import * as PusherPushNotifications from '@pusher/push-notifications-web';
import Debug from 'debug';

const debug = Debug('web:Pusher');

export class PusherClient {
  private client: PusherPushNotifications.Client;

  constructor(protected readonly serviceWorkerRegistration: ServiceWorkerRegistration) {}

  public async init() {
    debug('initPusher', this.serviceWorkerRegistration);

    this.client = new PusherPushNotifications.Client({
      instanceId: process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID,
      serviceWorkerRegistration: this.serviceWorkerRegistration,
    });

    try {
      await this.client.start();

      const deviceId = await this.client.getDeviceId();

      debug('beamsClient.getDeviceId: ', deviceId);

      await this.client.addDeviceInterest(`device-${deviceId}`);

      debug('addDeviceInterest', `device-${deviceId}`);

      // debug interest
      await this.client.addDeviceInterest(`debug-${deviceId}`);
      debug('addDeviceInterest', `debug-${deviceId}`);

      // await beamsClient.setUserId('user-' + deviceId, {
      //     async fetchToken(userId: string): Promise<TokenProviderResponse> {
      //         return { token: deviceId };
      //     }
      // });

      debug('Successfully registered and subscribed!');

      return deviceId;
    } catch (e) {
      debug('init error: ', e);
    }

    return null;
  }

  public async deactivate() {
    try {
      await this.client.stop();
    } catch (e) {
      debug('deactivate error: ', e);
    }
  }

  public async getDeviceInterest() {
    const interests = await this.client.getDeviceInterests();

    return interests;
  }

  public async removeDeviceInterest(topic: string) {
    try {
      await this.client.removeDeviceInterest(topic);
    } catch (e) {
      debug('removeDeviceInterest error: ', e);
    }
  }
}
