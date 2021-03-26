/* eslint-disable global-require, @typescript-eslint/no-var-requires */
const withPWA = require('next-pwa');
const withPlugins = require('next-compose-plugins');
const runtimeCaching = require('next-pwa/cache');
const withTM = require('next-transpile-modules')(['@pusher/push-notifications-web']);
/* eslint-enable global-require, @typescript-eslint/no-var-requires */

const NODE_ENV = process.env.NODE_ENV || 'development';
const isDev = NODE_ENV === 'development';

const nextConfig = {
  poweredByHeader: false,
  env: {
    DEBUG: isDev ? 'web:*' : undefined,
  },
  webpack: config => {
    config.module.rules.push({
      test: /react-spring/,
      sideEffects: true,
    });

    return config;
  },
};

module.exports = withPlugins(
  [
    [withTM],
    [
      withPWA,
      {
        pwa: {
          dest: 'public',
          runtimeCaching,
          importScripts: ['pusher-service-worker.js'],
        },
      },
    ],
  ],
  nextConfig
);
