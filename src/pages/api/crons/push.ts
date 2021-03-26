import Debug from 'debug';
import { NextApiHandler } from 'next';
import { createList } from '../../../helpers';
import { withExceptionHandler } from '../../../helpers/error-handler';

const debug = Debug('api:feeds');

const handler: NextApiHandler = async (req, res) => {
  // ------------ START TEMP --------- //
  // const projects = await getAllProjects();
  // const handles = projects
  //   .map(p => (p.socialLinks.find(s => s.type === 'twitter') || {}).url || null)
  //   .filter(handle => !!handle)
  //   .map(
  //     handle =>
  //       handle
  //         .split(/http(s)?:\/\/(mobile.|www.)?twitter.com\//)
  //         .find((_, index, arr) => index === arr.length - 1) // get last pattern
  //         .replace(/\/$/, '') // trim the last slash
  //         .replace(/^@/, '') // remove starting @
  //   )
  //   .filter(handle => !/^http/.test(handle));

  // await handles
  //   .map(handle => async () => {
  //     console.log(handle);

  //     await createStatus(handle, {
  //       type: 'twitter',
  //       username: handle,
  //     });
  //   })
  //   .reduce(asyncParallel<void>(5), Promise.resolve([]));

  // return res.end();
  // ------------ END TEMP ----------- //

  try {
    const tweets = await createList('nodefi');

    // TODO
    // if (status.type === 'discord')
    // if (status.type === 'snapshot')
    // if (status.type === 'telegram')

    return res.json(tweets);
  } catch (ex) {
    console.log(ex);
    debug('error', ex);
  }

  return res.status(404).end();
};

export default withExceptionHandler(handler);
