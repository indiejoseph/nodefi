import { ethers } from 'ethers';
import Twit from 'twit';
import web3 from 'web3';
import { Feed, Tweet } from '../interfaces';
import { getProject } from './datastore-api';

const {
  ETHERSCAN_API_KEY,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET,
  IMAGE_CDN_PREFIX,
} = process.env;

const twitClient = new Twit({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token: TWITTER_ACCESS_TOKEN,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
  strictSSL: true,
});

export function asyncParallel<T>(thread: number) {
  return async (p: Promise<T[]>, _: any, index: number, arr: Array<() => Promise<T>>) => {
    const list = await p;

    // chucking
    if (index % thread === 0) {
      return list.concat(
        await Promise.all(arr.slice(index, Math.min(index + 12, arr.length)).map(ops => ops()))
      );
    }

    return list;
  };
}

/**
 * Get tweets by user
 * @param screenName
 * @returns
 */
export async function getTweets(screenName: string) {
  const tweets = await twitClient.get('statuses/user_timeline', {
    exclude_replies: true,
    screen_name: screenName,
    count: 2,
    include_rts: false,
  });

  return tweets.data as Tweet[];
}

export async function getHomeTweets() {
  const tweets = await twitClient.get('statues/home_timeline', {
    exclude_replies: true,
    trim_user: true,
    include_entities: false,
  });

  return tweets.data as Tweet[];
}

export async function createList(
  name: string,
  mode: 'private' | 'public' = 'private',
  description?: string
) {
  const list = await twitClient.post('lists/create', {
    name,
    mode,
    description,
  });

  return list.data;
}

export async function createMemberAll(listId: string, screenName?: string) {
  const members = await twitClient.post('lists/members/create_all.json', {
    list_id: listId,
    screen_name: screenName,
  });

  return members.data;
}

export async function getInteractedContractAddresses(address: string, network: string) {
  const provider = new ethers.providers.EtherscanProvider(network, ETHERSCAN_API_KEY);
  const txns = await provider.getHistory(address);
  const contractAddresses = txns
    // ERC20 approve method only
    // FIXME: should consider the transfer method for ERC20 and ERC-721
    .filter(tx => tx.from === address)
    // get contract addresses
    .map(tx => tx.to)
    // remove duplicated contracts
    .filter((contractAddr, index, arr) => arr.indexOf(contractAddr) === index);

  return contractAddresses;
}

export async function getContractAddresses(address: string, network: string): Promise<string[]> {
  const contractAddresses = await getInteractedContractAddresses(address, network);
  const contracts = await contractAddresses
    .map(contractAddr => async () => web3.utils.toChecksumAddress(contractAddr))
    .reduce(asyncParallel<string>(12), Promise.resolve([] as string[]));

  return Array.from(new Set(contracts));
}

export async function getFeeds(topic: string) {
  const project = await getProject(topic);
  const twitter = (project.socialLinks.find(s => s.type === 'twitter') || {}).url || null;
  let feeds: Feed[] = [];

  if (twitter) {
    const handle = twitter.split('https://twitter.com/')[1];
    const tweets = await getTweets(handle);

    feeds = tweets.map<Feed>(tweet => ({
      id: tweet.id_str,
      avatar: `${IMAGE_CDN_PREFIX}${project.logo}`,
      url: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
      description: tweet.text,
      date: new Date(tweet.created_at),
      profileUrl: `https://twitter.com/${tweet.user.screen_name}`,
      profileName: project.name,
    })) as Feed[];
  }

  return feeds;
}
