import { ButtonDropdown, Dot } from '@geist-ui/react';
import React, { useContext } from 'react';
import { Flex, FlexProps } from 'rebass';
import styled from 'styled-components';
import { ConnectContext } from '../../contexts/connection.context';

declare global {
  interface Window {
    ethereum: any;
  }
}

export type NetworkConnectorProps = FlexProps;

const Container = styled(Flex)`
  height: 100%;
`;

export const NetworkConnector: React.FC<NetworkConnectorProps> = () => {
  const { address, isConnected, disconnect } = useContext(ConnectContext);
  const shortAddress = address ? `${address.substr(0, 5)}…${address.substr(-4)}` : '';

  return (
    <Container alignItems="center" flexDirection="column" justifyContent="center" px={3}>
      {isConnected ? (
        <ButtonDropdown>
          <ButtonDropdown.Item main>
            <Dot style={{ marginRight: '20px' }} type="success">
              {shortAddress}
            </Dot>
          </ButtonDropdown.Item>
          <ButtonDropdown.Item onClick={disconnect}>Disconnect</ButtonDropdown.Item>
        </ButtonDropdown>
      ) : null}
    </Container>
  );
};
