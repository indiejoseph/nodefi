import { Page } from '@geist-ui/react';
import { NextPage } from 'next';
import React from 'react';
import { Navigation } from '../components';

const IndexPage: NextPage = () => (
  <>
    <Navigation />
    <Page size="small">Hihi</Page>
  </>
);

export default IndexPage;
