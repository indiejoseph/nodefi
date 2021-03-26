import { Text } from '@geist-ui/react';
import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../components';

const DappsPage: NextPage = () => (
  <Layout activeMenuItem="dapps">
    <Text h1>dApps</Text>
    <Text p>Under construction</Text>
  </Layout>
);

export default DappsPage;
