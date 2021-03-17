import Debug from 'debug';
import React, { createContext, useState } from 'react';
import { PusherClient } from '../helpers/pusher';

const debug = Debug('web:use-push');

declare global {
  interface Window {
    workbox: any;
  }
}

export interface PushContextProps {
  isSubscribed: boolean;
  subscription: PushSubscription | null;
  registration: ServiceWorkerRegistration | null;
  client: PusherClient | null;
  subscribe: () => void;
}

export const PushContext = createContext<PushContextProps>({
  isSubscribed: false,
  subscription: null,
  registration: null,
  subscribe: null,
  client: null,
});

export const PushProvider: React.FC = ({ children }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [client, setClient] = useState<PusherClient | null>(null);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const initServerWorker = async () => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      try {
        const reg = await window.navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        const pushClient = new PusherClient(reg);

        debug('initial registration');

        pushClient.init();

        setClient(pushClient);
        setRegistration(reg);

        if (sub) {
          debug('sub.expirationTime: ', sub.expirationTime);

          if (!(sub.expirationTime && Date.now() > sub.expirationTime - 5 * 60 * 1000)) {
            setSubscription(sub);
            setIsSubscribed(true);
          }
        }
      } catch (ex) {
        debug('error: ', ex);
      }
    }
  };

  return (
    <PushContext.Provider
      value={{ subscribe: initServerWorker, isSubscribed, subscription, registration, client }}
    >
      {children}
    </PushContext.Provider>
  );
};
