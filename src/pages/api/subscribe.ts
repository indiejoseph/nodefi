import PushNotifications from '@pusher/push-notifications-server';
import Debug from 'debug';
import { NextApiHandler } from 'next';

const debug = Debug('api:subscribe');

const pushNotifications = new PushNotifications({
  instanceId: process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID,
  secretKey: process.env.PUSHER_BEAMS_SECRET_KEY,
});

const handler: NextApiHandler = async (_req, res) => {
  res.status(201).json({});

  try {
    const publishResponse = await pushNotifications.publishToInterests(['hello'], {
      web: {
        notification: {
          title: 'Hello',
          body: 'Hello, world!',
        },
      },
    });

    debug('Just published:', publishResponse.publishId);
  } catch (ex) {
    debug(ex);
  }
};

export default handler;
