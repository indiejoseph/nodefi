import * as Sentry from '@sentry/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import React from 'react';
import { ConnectionProvider } from '../contexts/connection.context';
import { PushProvider } from '../contexts/push.context';

const NODE_ENV = process.env.NODE_ENV || 'development';
const isDev = NODE_ENV === 'development';

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    enabled: !isDev,
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  });
}

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const App: React.FC<AppProps & { err: any }> = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title key="title">Nodefi</title>
      <meta content="initial-scale=1.0, width=device-width" name="viewport" />
      <link href="/icons/icon-512x512.png" rel="shortcut icon" />
      <link href="/icons/icon-512x512.png" rel="apple-touch-icon" />
      <link href="/icons/icon-512x512.png" rel="shortcut icon" sizes="512x512" type="image/png" />
      <link href="/icons/icon-96x96.png" rel="shortcut icon" sizes="96x96" type="image/png" />
      <link href="/icons/icon-32x32.png" rel="shortcut icon" sizes="32x32" type="image/png" />
      <link href="/manifest.json" rel="manifest" />
      <link href="https://fonts.gstatic.com" rel="preconnect" />
      <link
        href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap"
        rel="stylesheet"
      />
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
