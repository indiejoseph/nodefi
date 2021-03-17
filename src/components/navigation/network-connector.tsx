import { Badge, Button, Col, Row } from '@geist-ui/react';
import { ColProps } from '@geist-ui/react/dist/col/col';
import { RowProps } from '@geist-ui/react/dist/row/row';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { ConnectContext } from '../../contexts/connection.context';

declare global {
  interface Window {
    ethereum: any;
  }
}

export interface NetworkConnectorProps extends Partial<RowProps> {
  address?: string;
}

const Container = styled<RowProps>(Row)`
  line-height: 42px;
  padding: 12px;
`;

const FitContentCol = styled<ColProps>(Col)`
  && {
    width: fit-content !important;
  }
`;

export const NetworkConnector: React.FC<NetworkConnectorProps> = () => {
  const { connectWeb3, address, isConnected, disconnect } = useContext(ConnectContext);
  const shortAddress = address ? `${address.substr(0, 5)}…${address.substr(-4)}` : '';

  return (
    <>
      <Container gap={0.8} justify="end">
        {isConnected ? (
          <>
            <FitContentCol>
              <Badge size="medium">{shortAddress}</Badge>
            </FitContentCol>
            <FitContentCol>
              <Button style={{ minWidth: 'auto' }} onClick={disconnect}>
                Disconnect
              </Button>
            </FitContentCol>
          </>
        ) : (
          <FitContentCol style={{ width: 'fit-content' }}>
            <Button style={{ minWidth: 'auto' }} type="secondary" onClick={connectWeb3}>
              Connect Wallet
            </Button>
          </FitContentCol>
        )}
      </Container>
    </>
  );
};
