import Debug from 'debug';
import { useRouter } from 'next/router';
import React, { ComponentType, useContext, useEffect, useState } from 'react';
import { Flex } from 'rebass';
import { SpinningLogo } from '../components';
import { ConnectContext, ConnectionProps } from '../contexts';

const debug = Debug('web:with-page-connected');

export type WithConnectionRequired = <P extends ConnectionProps>(
  Component: ComponentType<P>
) => React.FC<P>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const withConnectionRequired: WithConnectionRequired = Component =>
  function withConnectionRequiredHoc(props): JSX.Element {
    const ctx = useContext(ConnectContext);
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      if (ctx.isInitialized) {
        setTimeout(() => {
          setIsReady(true);
        }, 1000);
      }

      if (!ctx.isConnected && ctx.isInitialized) {
        debug('redirect to home page');

        router.push('/');
      }
    }, [ctx.isConnected, ctx.isInitialized]);

    return isReady ? (
      <Component {...ctx} {...props} />
    ) : (
      <Flex
        alignItems="center"
        justifyContent="center"
        sx={{
          width: '100vw',
          height: '100vh',
        }}
      >
        <SpinningLogo />
      </Flex>
    );
  };
