import { Page } from '@geist-ui/react';
import React from 'react';
import styled from 'styled-components';
import { Navigation } from '../navbar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export interface LayoutProps {
  activeMenuItem: string;
}

export const Layout: React.FC<LayoutProps> = ({ activeMenuItem, children, ...props }) => (
  <Container {...props}>
    <Navigation activeMenuItem={activeMenuItem} />
    <Page size="small">{children}</Page>
  </Container>
);
