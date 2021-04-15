import Debug from 'debug';
import createError from 'http-errors';
import { NextApiHandler } from 'next';
import { getContract } from '../../../helpers';
import { withExceptionHandler } from '../../../helpers/error-handler';

const debug = Debug('api:topics');

const handler: NextApiHandler = async (req, res) => {
  const { address } = req.query;

  if (!address) {
    throw createError(400, 'Invalid address');
  }

  try {
    const contact = await getContract(address.toString());

    return res.json(contact);
  } catch (ex) {
    debug('error', ex);
  }

  return res.status(404).end();
};

export default withExceptionHandler(handler);
