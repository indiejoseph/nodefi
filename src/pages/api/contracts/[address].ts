import Debug from 'debug';
import createError from 'http-errors';
import { NextApiHandler } from 'next';
import { withExceptionHandler } from '../../../helpers/error-handler';
import { getContractAddresses } from '../../../helpers/ops';

const debug = Debug('api:topics');

const handler: NextApiHandler = async (req, res) => {
  const { address } = req.query;

  if (!address) {
    throw createError(400, 'Invalid address');
  }

  try {
    const contractAddresses = await getContractAddresses(address.toString(), 'homestead');

    return res.json(contractAddresses);
  } catch (ex) {
    debug('error', ex);
  }

  return res.status(404).end();
};

export default withExceptionHandler(handler);
