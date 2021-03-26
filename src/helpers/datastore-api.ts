import { Datastore } from '@google-cloud/datastore';
import { Contract, Project, Status } from '../interfaces';

const { GOOGLE_APPLICATION_CREDENTIALS, GCP_PROJECT_ID } = process.env;

if (!GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error('No GOOGLE_APPLICATION_CREDENTIALS');
}

const credentials = JSON.parse(Buffer.from(GOOGLE_APPLICATION_CREDENTIALS, 'base64').toString());
const datastore = new Datastore({
  projectId: GCP_PROJECT_ID,
  credentials,
});

export async function getContract(address: string): Promise<Contract> {
  const [entity] = await datastore.get(datastore.key(['contracts', address]));
  const { name, slug } = entity as any;

  if (!entity) {
    throw new Error('Not found');
  }

  return {
    address: entity[datastore.KEY].name,
    name,
    slug,
  };
}

export async function getProject(slug: string): Promise<Project> {
  const [entity] = await datastore.get(datastore.key(['projects', slug]));
  const { name, website, socialLinks, logo, description } = entity as any;

  if (!entity) {
    throw new Error('Not found');
  }

  return {
    slug: entity[datastore.KEY].name,
    name,
    website,
    socialLinks,
    logo,
    description,
  };
}

/**
 * Get all projects
 * @returns all projects
 */
export async function getAllProjects(): Promise<Project[]> {
  const query = datastore.createQuery('projects');
  const [projects] = await datastore.runQuery(query);

  return projects;
}

/**
 * Get earliest status
 * @returns earliest status
 */
export async function getEarliestStatuses(limit = 10): Promise<Status[]> {
  const query = datastore.createQuery('statuses').order('updatedAt').limit(limit);
  const [status] = await datastore.runQuery(query);

  return status;
}

/**
 * create a status
 * @param slug
 * @param status
 */
export async function createStatus(slug: string, status: Status) {
  const key = datastore.key(['statuses', `${status.type}/${slug}`]);

  await datastore.save({
    key,
    data: [
      {
        name: 'type',
        value: status.type,
      },
      {
        name: 'username',
        value: status.username,
      },
      {
        name: 'updatedAt',
        value: new Date(),
      },
      ...(status.sinceId
        ? [
            {
              name: 'sinceId',
              value: status.sinceId,
            },
          ]
        : []),
    ],
  });
}

/**
 * update a status
 * @param slug
 * @param sinceId
 */
export async function updateStatus(
  slug: string,
  type: 'twitter' | 'discord' | 'telegram' | 'snapshot',
  sinceId?: string
) {
  const key = datastore.key(['statuses', `${type}/${slug}`]);
  const [entity] = await datastore.get(key);

  await datastore.save({
    key,
    data: {
      ...entity,
      updatedAt: new Date(),
      sinceId,
    },
  });
}
