import { Col, Row } from '@geist-ui/react';
import { RowProps } from '@geist-ui/react/dist/row/row';
import React from 'react';
import styled from 'styled-components';
import { NetworkConnector } from './network-connector';
import { TopMenu } from './top-menu';

const Container = styled(Row)`
  background: white;
  padding: 0 12px 0;
`;

export interface NavigationProps extends Partial<RowProps> {
  address?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ address, ...props }) => (
  <Container {...props}>
    <Col>
      <TopMenu />
    </Col>
    <Col>
      <NetworkConnector address={address} />
    </Col>
  </Container>
);
