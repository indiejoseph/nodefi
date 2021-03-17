import * as Sentry from '@sentry/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import React from 'react';
import { ConnectionProvider } from '../contexts/connection.context';
import { PushProvider } from '../contexts/use-push.context';

const NODE_ENV = process.env.NODE_ENV || 'development';
const isDev = NODE_ENV === 'development';
const isNode = typeof window === 'undefined';

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  if (isNode) {
    Sentry.init({
      enabled: !isDev,
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    });
  } else {
    Sentry.init({
      enabled: !isDev,
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    });
  }
}

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const App: React.FC<AppProps & { err: any }> = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title />
      <link href="/icons/icon-512x512.png" rel="shortcut icon" />
      <link href="/icons/icon-512x512.png" rel="apple-touch-icon" />
      <link href="/manifest.json" rel="manifest" />
      <meta content="The missing DeFi protocols notification centra" name="description" />
    </Head>

    <PushProvider>
      <ConnectionProvider>
        <Component {...pageProps} />
      </ConnectionProvider>
    </PushProvider>
  </>
);

export default App;
