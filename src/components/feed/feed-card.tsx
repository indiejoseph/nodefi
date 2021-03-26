import { Avatar, Card, Divider, Link, Text } from '@geist-ui/react';
import LinkIcon from '@geist-ui/react-icons/link';
import React from 'react';
import Linkfiy from 'react-linkify';
import { Box, BoxProps, Flex } from 'rebass';
import { Feed } from '../../interfaces';

export type FeedCardProps = BoxProps & Feed;

export const FeedCard: React.FC<FeedCardProps> = ({
  avatar,
  profileName,
  description,
  profileUrl,
  date,
  url,
  ...props
}) => (
  <Box {...props}>
    <Card hoverable>
      <Card.Content>
        <Flex flexDirection="row">
          <Box sx={{ width: 'fit-content' }}>
            <Avatar alt={profileName} src={avatar} width="24px" />
          </Box>
          <Box ml={1}>
            <Link href={profileUrl} rel="noopener noreferrer" target="_blank">
              <Text b style={{ lineHeight: '32px' }}>
                {profileName}
              </Text>
            </Link>
          </Box>
          <Box ml="auto">
            <Link href={url} rel="noopener noreferrer" target="_blank">
              <LinkIcon size="22px" />
            </Link>
          </Box>
        </Flex>
      </Card.Content>
      <Divider y={0} />
      <Card.Content>
        <Text size="1.25em">
          <Linkfiy>{description}</Linkfiy>
        </Text>
        <Text
          small
          style={{ color: '#666' }}
        >{`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}</Text>
      </Card.Content>
    </Card>
  </Box>
);
