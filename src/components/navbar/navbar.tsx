import { Popover, Tabs } from '@geist-ui/react';
import MenuIcon from '@geist-ui/react-icons/menu';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Box, Flex } from 'rebass';
import styled from 'styled-components';
import { NetworkConnector } from './network-connector';

const Container = styled(Flex)`
  background-color: white;
  height: 60px;
  top: 0;
  left: 0;
  right: 0;
  box-sizing: content-box;
  position: sticky;
  z-index: 999;
  border-bottom: 1px solid #eaeaea;

  & > div {
    height: 100%;
  }

  .tabs {
    &,
    & > header,
    & > header > .tab {
      height: 100%;
    }
  }

  .logo {
    vertical-align: top;
  }

  .tooltip {
    line-height: 60px;

    & > svg {
      vertical-align: middle;
    }
  }
`;

export interface NavigationProps {
  activeMenuItem?: string;
}

export const menuItems = {
  dashboard: 'Dashboard',
  dapps: 'Your dApps',
};

export const Navigation: React.FC<NavigationProps> = ({ activeMenuItem, ...props }) => {
  const router = useRouter();
  const handleTabsChange = (val: string) => {
    router.push(`/${val}`);
  };

  return (
    <Container {...props} justifyContent="flex-start">
      <Box display={['block', 'none']} px={3}>
        <Popover
          content={() =>
            Object.keys(menuItems).map((item, index) => (
              <Popover.Item key={index.toString()}>
                <Link href={`/${item}`}>{menuItems[item]}</Link>
              </Popover.Item>
            ))
          }
          placement="bottomStart"
        >
          <MenuIcon />
        </Popover>
      </Box>
      <Box display={['none', 'block']} px={4} sx={{ minWidth: '110px' }} width="fit-content">
        <Link href="/dashboard">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a style={{ display: 'block', lineHeight: 0 }}>
            <Image className="logo" height="60px" src="/logo.svg" width="120px" />
          </a>
        </Link>
      </Box>
      <Box as="nav" display={['none', 'block']} height="60px" px={3}>
        <Tabs value={activeMenuItem} onChange={handleTabsChange}>
          {Object.keys(menuItems).map((item, index) => (
            <Tabs.Item key={index.toString()} label={menuItems[item]} value={item} />
          ))}
        </Tabs>
      </Box>
      <Box ml="auto">
        <NetworkConnector />
      </Box>
    </Container>
  );
};
