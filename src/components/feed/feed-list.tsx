import React from 'react';
import { Flex, FlexProps } from 'rebass';
import styled from 'styled-components';
import { Feed } from '../../interfaces';
import { FeedCard } from './feed-card';

const FeedContainer = styled(Flex)``;

export interface FeedListProps extends FlexProps {
  items: Feed[];
}

export const FeedList: React.FC<FeedListProps> = ({ items, ...props }) => (
  <FeedContainer flexDirection="column" {...props}>
    {items.map((item, index) => (
      <FeedCard key={index.toString()} mb={3} {...item} />
    ))}
  </FeedContainer>
);
