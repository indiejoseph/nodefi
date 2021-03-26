import { Text, useToasts } from '@geist-ui/react';
import Debug from 'debug';
import fetch from 'isomorphic-unfetch';
import { NextPage } from 'next';
import React, { useContext, useEffect, useState } from 'react';
import { FeedList, FeedListSkeleton, Layout } from '../components';
import { PushContext } from '../contexts';
import { ConnectionProps } from '../contexts/connection.context';
import { withConnectionRequired } from '../helpers/with-page-connected';
import { Feed } from '../interfaces';

const debug = Debug('web:dashboard');

const DashboardPage: NextPage<ConnectionProps> = ({ address }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [feed, setFeeds] = useState<Feed[]>([]);
  const { client, subscribe, isSubscribed } = useContext(PushContext);
  const [topics, setTopics] = useState<string[]>([]);
  const [, setToast] = useToasts();

  useEffect(() => {
    setIsLoading(true);

    fetch(`/api/feeds/${address}`)
      .then(async response => {
        const result = (await response.json()) as any;

        setTopics(result.topics);

        setFeeds(
          (result.feeds || []).map((f: Feed) => ({
            ...f,
            date: new Date(f.date),
          }))
        );

        setIsLoading(false);

        return true;
      })
      .catch(ex => {
        debug(ex);

        setToast({
          text: 'Server error, please try again later',
          type: 'error',
        });

        setIsLoading(false);
      });
  }, [address]);

  useEffect(() => {
    if (!client && !isSubscribed) {
      subscribe();
    }

    if (client && isSubscribed && topics && topics.length) {
      // get device interests
      client
        .getDeviceInterest()
        .then(interests =>
          topics
            .map(topic => () => {
              if (interests.findIndex(interest => interest === `unsubscribed:${topic}`) !== -1) {
                debug('ignore unsubscribed topic: ', topic);

                return;
              }

              debug('addDeviceInterest: ', topic);
              client.addDeviceInterest(topic);
            })
            .reduce(async (p, ops) => {
              await p;

              return ops();
            }, Promise.resolve())
        )
        .catch(ex => {
          debug('subscribe error: ', ex);
        });
    }
  }, [topics, client, isSubscribed]);

  return (
    <Layout activeMenuItem="dashboard">
      <Text h1>Feed</Text>
      {isLoading ? <FeedListSkeleton number={10} /> : <FeedList items={feed} />}
    </Layout>
  );
};

export default withConnectionRequired(DashboardPage);
