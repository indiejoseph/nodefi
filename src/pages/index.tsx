import { Button, Page, Text } from '@geist-ui/react';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { Box, Flex } from 'rebass';
import { ConnectContext } from '../contexts/connection.context';

const IndexPage: NextPage = () => {
  const { isConnected, isInitialized, connect } = useContext(ConnectContext);
  const router = useRouter();

  useEffect(() => {
    if (isConnected && isInitialized) {
      router.push('/dashboard');
    }
  }, [isConnected, isInitialized]);

  return (
    <Page size="small">
      <Flex alignItems="center" flexDirection="column" justifyContent="center" mt="20vh">
        <Box mb={2}>
          <Image alt="Nodefi" height="100px" src="/logo.svg" width="280px" />
        </Box>

        <Box maxWidth="600px" mb={3} textAlign="center">
          <Text h3>
            One click to subscribe to all Defi protocols that your wallet has interacted with.
          </Text>
        </Box>

        <Box textAlign="center">
          <Button auto shadow size="large" type="secondary" onClick={connect}>
            <b>Connect Wallet</b>
          </Button>
          <Text style={{ fontSize: '14px' }}>
            *We will not store your personal data, wallet address nor history.
          </Text>
        </Box>
      </Flex>
    </Page>
  );
};

export default IndexPage;
