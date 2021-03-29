import Debug from 'debug';
import createError from 'http-errors';
import { NextApiHandler } from 'next';
import { withExceptionHandler } from '../../../helpers/error-handler';
import { getFeeds } from '../../../helpers/ops';

const debug = Debug('api:feeds');

const handler: NextApiHandler = async (req, res) => {
  const { topic } = req.query;

  if (!topic) {
    throw createError(400, 'Invalid topic');
  }

  try {
    const result = await getFeeds(topic.toString());

    return res.json(result);
  } catch (ex) {
    debug('error', ex);
  }

  return res.status(404).end();
};

export default withExceptionHandler(handler);
