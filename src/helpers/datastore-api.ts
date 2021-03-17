import { Datastore } from '@google-cloud/datastore';
import { Contract, Project } from '../interfaces';

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
