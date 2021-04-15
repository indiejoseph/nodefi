import { Text, useToasts } from '@geist-ui/react';
import Debug from 'debug';
import fetch from 'isomorphic-unfetch';
import { NextPage } from 'next';
import React, { useContext, useEffect, useState } from 'react';
import { FeedList, FeedListSkeleton, Layout } from '../components';
import { PushContext } from '../contexts';
import { ConnectionProps } from '../contexts/connection.context';
import { withConnectionRequired } from '../helpers/with-page-connected';
import { Contract, Feed } from '../interfaces';

const debug = Debug('web:dashboard');
const THREAD = 5;

async function getContractsClient(address: string) {
  const response = await fetch(`/api/contracts/${address}`);
  const topics = (await response.json()) as string[];

  return topics;
}

async function getFeedsByTopicClient(topic: string) {
  const response = await fetch(`/api/feeds/${topic}`);
  const feeds = (await response.json()) as Feed[];

  return feeds;
}

async function getContractClient(address: string) {
  const response = await fetch(`/api/contract/${address}`);
  const topics = (await response.json()) as Contract;

  return topics;
}

async function getFeedsClient(address: string) {
  const contacts = await getContractsClient(address);
  const topics = [];
  const feeds = await contacts
    .map(contractAddress => async () => {
      const contract = await getContractClient(contractAddress).catch(() => null);
      const topic = contract ? contract.slug : 'unknown';

      if (topic === 'unknown' || topics.indexOf(topic) !== -1) {
        return [];
      }

      const contractFeeds = await getFeedsByTopicClient(contract.slug).catch(() => []);

      topics.push(topic);

      return contractFeeds;
    })
    .reduce(async (p, _ops, index, arr) => {
      const list = await p;

      if (index % THREAD === 0) {
        list.push(
          ...(await Promise.all(
            arr
              .slice(index, index + THREAD)
              .map(ops => ops().then(fs => fs.map(f => ({ ...f, date: new Date(f.date) }))))
          ))
        );
      }

      return list;
    }, Promise.resolve([]));

  return {
    topics,
    feeds: feeds
      .reduce((list, myList) => list.concat(...myList), [])
      .sort((a, b) => b.date.getTime() - a.date.getTime()),
  };
}

const DashboardPage: NextPage<ConnectionProps> = ({ address }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const { client, subscribe, isSubscribed } = useContext(PushContext);
  const [topics, setTopics] = useState<string[]>([]);
  const [, setToast] = useToasts();

  useEffect(() => {
    setIsLoading(true);

    getFeedsClient(address)
      .then(({ feeds: myFeeds, topics: myTopics }) => {
        setTopics(myTopics);
        setFeeds(myFeeds);
        setIsLoading(false);

        return { feeds: myFeeds, topics: myTopics };
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
      {isLoading ? <FeedListSkeleton number={10} /> : <FeedList items={feeds} />}
    </Layout>
  );
};

export default withConnectionRequired(DashboardPage);
