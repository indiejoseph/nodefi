import Debug from 'debug';
import { ethers } from 'ethers';
import createError from 'http-errors';
import { NextApiHandler } from 'next';
import web3 from 'web3';
import { getContract } from '../../../helpers/datastore-api';
import { withExceptionHandler } from '../../../helpers/error-handler';
import { Contract } from '../../../interfaces';

const debug = Debug('api:txns');
const { ETHERSCAN_API_KEY } = process.env;

async function getContracts(address: string, network: string): Promise<Contract[]> {
  const provider = new ethers.providers.EtherscanProvider(network, ETHERSCAN_API_KEY);
  const txns = await provider.getHistory(address);
  const contractAddresses = txns
    // ERC20 approve method only
    // FIXME: should consider transfer method for ERC20 and ERC-721
    .filter(tx => tx.from === address)
    // get contract addresses
    .map(tx => tx.to)
    // remove duplicated contracts
    .filter((contractAddr, index, arr) => arr.indexOf(contractAddr) === index);

  const contracts = await contractAddresses
    .map(contractAddr => async () => {
      const checksumAddress = web3.utils.toChecksumAddress(contractAddr);
      const contract = await getContract(checksumAddress).catch(() => ({
        address: contractAddr,
        name: 'Unknown',
        slug: 'unknown',
      }));

      return contract;
    })
    .reduce(async (p, _, index, arr) => {
      const list = await p;

      // chucking to 12 parallel
      if (index % 12 === 0) {
        return list.concat(
          await Promise.all(arr.slice(index, Math.min(index + 12, arr.length)).map(ops => ops()))
        );
      }

      return list;
    }, Promise.resolve([] as any[]));

  return contracts;
}

const handler: NextApiHandler = async (req, res) => {
  const { address, network } = req.query;

  if (!address) {
    throw createError(400, 'Invalid address');
  }

  if (!network) {
    throw createError(400, 'Invalid network');
  }

  try {
    const contracts = await getContracts(address.toString(), network.toString());

    return res.json(contracts);
  } catch (ex) {
    debug('error', ex);
  }

  return res.status(404).end();
};

export default withExceptionHandler(handler);
