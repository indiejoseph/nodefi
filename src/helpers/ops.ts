import { ethers } from 'ethers';
import Twit from 'twit';
import web3 from 'web3';
import { Contract, Feed, Tweet } from '../interfaces';
import { getContract, getProject } from './datastore-api';

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

export async function getTopics(address: string, network: string): Promise<string[]> {
  const contractAddresses = await getInteractedContractAddresses(address, network);
  const contracts = await contractAddresses
    .map(contractAddr => async () => {
      const checksumAddress = web3.utils.toChecksumAddress(contractAddr);
      const contract = await getContract(checksumAddress).catch(() => ({
        address: contractAddr,
        name: 'Unknown',
        slug: 'unknown',
      }));

      return contract;
    })
    .reduce(asyncParallel<Contract>(12), Promise.resolve([] as Contract[]));
  const topics = contracts
    .map(({ slug }) => slug)
    .filter((slug, index, arr) => arr.indexOf(slug) !== index) // remove duplicated
    .filter(slug => slug && slug !== 'unknown');

  return Array.from(new Set(topics));
}

export async function getFeeds(address: string, network: string) {
  const topics = await getTopics(address, network);
  const feeds = (
    await topics
      .map(topic => async () => {
        const project = await getProject(topic);
        const twitter = (project.socialLinks.find(s => s.type === 'twitter') || {}).url || null;

        if (twitter) {
          const handle = twitter.split('https://twitter.com/')[1];
          const tweets = await getTweets(handle);

          return tweets.map<Feed>(tweet => ({
            id: tweet.id_str,
            avatar: `${IMAGE_CDN_PREFIX}${project.logo}`,
            url: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
            description: tweet.text,
            date: new Date(tweet.created_at),
            profileUrl: `https://twitter.com/${tweet.user.screen_name}`,
            profileName: project.name,
          })) as Feed[];
        }

        return [] as Tweet[];
      })
      .reduce(asyncParallel<Feed[]>(12), Promise.resolve([] as Feed[][]))
  )
    // flatten the array
    .reduce((arr, tweets) => arr.concat(tweets), [])
    // remove duplicated
    .filter((tweet, i, arr) => arr.findIndex(t => t.id === tweet.id) === i)
    // sort by create date
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return { feeds, topics };
}
