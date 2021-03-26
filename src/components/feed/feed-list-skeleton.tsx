import { Card } from '@geist-ui/react';
import React from 'react';
import ContentLoader from 'react-content-loader';
import { Box } from 'rebass';

export interface FeedListSkeletonProps {
  number?: number;
}

export const FeedListSkeleton: React.FC<FeedListSkeletonProps> = ({ number = 1, ...props }) => (
  <>
    {Array.from(new Array(number)).map((_, index) => (
      <Box key={index.toString()} mb={3}>
        <Card hoverable>
          <ContentLoader
            backgroundColor="#f0f0f0"
            foregroundColor="#dedede"
            height={190}
            width="100%"
            {...props}
          >
            <circle cx="24" cy="24" r="24" />
            <rect height="13" rx="4" ry="4" width="300" x="60" y="12" />
            <rect height="10" rx="3" ry="3" width="250" x="60" y="35" />
            <rect height="70" width="800" x="0" y="70" />
          </ContentLoader>
        </Card>
      </Box>
    ))}
  </>
);
