import { Datastore } from '@google-cloud/datastore';
import { Contract, Project, Status } from '../interfaces';
import { decrypt } from './encryption';

const { GOOGLE_APPLICATION_CREDENTIALS, GCP_PROJECT_ID } = process.env;

// Due to the Vercel environment variables length limitation, here I encrypted the google credentials with aes256
const encryptedGoogleCredentials =
  '4e114e930179342556a72b8c317ded13:3f7a7db3ef4116bad0d00b8d4d859dcfeed4bfd7f7336b473796ac9253f59396566b8ce16c6a151e58b56543ee123b0a34b80d5e5717078e0a69d3ce1306ccf53f3ae70216549849b0cfbddd15cc742e605522a7db0c0eaa79da0c742b744af9233e2027e7cdc1fb757e6a4f0664d6fffb5fdd9c8d9571034e55247fb9f79448eae3b9f92d5f0450c1e8c7131a1edb470b1dd4160488d5277189c240c6733bfc8eff0432c655f13889e5ad6230c775f2a7fde4da4e386647d01422034dc38bd3aaebffe95329f16d29576beba1ae0f35e8995ca849f461f494d5fc4a870b48d629f63e0cb1a134ffbaa35d833047a5d3ddf04f0b05d707fc1eca587472a086ec09f2c8ca22ee03c0c5abc54e0e80d778449af7a581289d4772d41982a782b5322c412fc11cc687b363175b271df74393acf18ddd8d984108110fc3b8e93bb22029c31c62cc97d1822d8ecdb3be218fe6cf8e2a044d4cb6fa5206e89a49691f17b4a05a579cd2fef5f278f360de42dde66e0961dee3396b544e5c0e950660032ae89de6846ff2ace9cb94c10ce44e0f18f37a7907af5f9e5a3af148be6c84acf2503b4368ea124ba1e95b088fe4df860aa3f27778b440a3822735da2e0c72500d37973fffca997d251a2f0b224b5747b27973bfbfd40258299d47991cd1fe39ddd7e256bd9ffd9cf5cc89268847cc81cea77abd8d7f14d6b0cd18e94a05bbe294a36a137a2fb290114c9fa30737611d8d0e7be4fd7787ab6de95314d262e2a891086d60a1d0d8bc481b6da61cbfbcb984879688b7c26eb5f1897c901f66373e1cadc6eb724db60ca61eb1512590c794339488981bbd99df34a32fdacfc1ac55a41305090863fcee9889d97521c8f09386f888b758b281e061df273e81479932f1076f358792ad247112d9b4b5ea8ec6f3141730a0a5f076e538e42a8f17a579d47d4ddaf5e3d396cee6f7224b675099877e8b4a0e70d050ba191b5add4f58d3fa2e3c79a8491ab2de6a26493e4bfbb0968ffe58ba211302319afb13b1a30f5f5e2873045038b8e322ecca383b247ae388669d4f294e7365ebcf1008b7e4341b38990725af7ffd83b629b85ea114fe949aa12fc2ae6da0565cd64b189eb462cef47cea3bc5784c5541823da7b0c21e8b2649e40ca8d078b23c6687f9115c09a22df335e88ee4f3f519ec4dcf8f5649ecb5a38a5decd11e7a242481b72203cc6c5a2250a8679d064866adfac2bb4feb6628ee4fe582f8cc1f83701cfea008cd470fefbed09152078bcda30517ce2c42a90cf82f498074ae39b909817539908d59eff10c84e16365aa252c921bf17e30f78a3a5a4969a0767783efb4e24c1c98107c8871144aec2e5f529ad9a5afa7d77cc9a9ede3d0f168c59858a99cb3f18c8441e82c8ccd7669d280d1617a537f036e346b219b07f1a815470ff43eb3b27208dcb0c92c3aa2b8dfd9695964f59a8e20b161d0de030df47effab47b7688f3a014309466921e93169e509ad1cfba0c4e342a1b5898ae4f341ec5d9d692ef413875fda138869f78775c3b03dd800c2ecfa3028979e02883146b7de4ea777c16e2edd4f76e936d9ca841582e32c9593e740e82b82d548e0851c01ac6d8b2b4200e9054db765752ee7bdcdb544649ba998ffde8326b09bf3dd1494da7b3b974d26c2fb82c1f3770bdfb4020eed1cfe4f3ef23cfcd9ce960ad1e9c9985ae7b9c8090f08432e858cb1c7d58a6134cf9184417fcef162d6467784ce8fd6bf5f586ab0d99e1f9459a5b37945d676c11728fa514aace04fa67692905737e3f3e26a5de2c3ca5b7916008365fb71b65a8df6eab6467ad4410b73e6d813720e2d20c85e6a54d6585c7e07bb716f32c6f369216d1b73d6339cccd80db663de6ef76d47f5a4a5074736e5b095e4caae716fb11d7e87b7d8a1f7175e1a82ecfd6a639d4e86c1575559c21d540391da0467f8ea79338b09a5728611f062c776006135a316a24f923135db285a6fbe3d396c932b79af9df8d96f5f1d1cb979a56681f07b370f010b8b248dbaed628af9af712c6419f067b48857a9ce515138b815daf764057dea118e9a32a1999ab8af46e63e7b6f82a4c3772f1f9abdbc6ed0063ab64c018e183a188c1a047d31fa8accc3595d17b4505690c09f9a64bb34f410239d052bf72edced931e3fe78f2db85650b9065770252b2eb60a6e694b661d8f1342c2a312df54ce9ec42001fa906b6336b4bfef44ab7dbe853fc55e4af9ec070e4a179d49c5cbb51099c9a5c840ad83cfe252068160fd6032c7f9eaaeb20edb2b52da4d5c9dad70ef11927e8471c170b902bd06115046601112c26c59f7e48bb9c6ebc73bd7a6905ef15855bee3a765c9da0199b611521b9f075653fe00da6269918f733fe3f11c0af821cf9e97526b18d1204e237cf6c217af8b7334f9b7f347cb240b294a3c7e8cbe6979a3bfc4e1dc248add3987869e6cfb437b4cbf5cbb64584ea197ce6634025a56cf6ff74b0a30f2b321a1f66bfc939f7881d8558877df48b6b7039fb77bbdb1ca25c7cff5305d2618f754d11deca6a3fc16644c556098bf0e2530c57f12e6f4d72e7248bf6993fa292290605c5e93b2be481569f8f344922d2b0cec15430d9196d9adf6150c5dd3ab813d26285b5c72661949b2c8d57f0cba555b91ee79f930c2b25f3b332127df9e127b76cd9d094e74e579321e8dab3e77f3ddae500ade4b8466345b900ba5a839df66d48e4d511c404080ac045305c40a461aa8939d7da65dfc0762dd84264bd22cc87e1edacf7e5ae8ed5d4441dd4179d7d2e34d01d61ad6484c913071d49d3ec1c05b6e84d72a41e71e3112a056ab14342c18b7c9077be87b761bf56e18d1421a3013e2873cd54e2be9036c30ab73959743cf7a959c58f682fc975d88acfe8ad54edda9e48c86aebeeb5d6d14ada1b6b7a7803d7c07465e619cc246748f7661ac1e10e00aa9a6a3405cab1f85dcfeb0982d0d1d157d89f3aa438fdaf2b1dca0638f2310cca6b4189f323c0f5f93792b6d17567d6799bce2f0d1800f11603935efcf7c820f4611a4f1251efe817bd85869abc45a30b24e3aff2a7d962851789e6fdfd5bfe92727291ba105787bf232ef187988d8b8aaf47f06c029f246bae31b6760522b9c3fcec323a1a5571f06ab576b885dbe6d8dd383469bfe23bdde58f4df65c72b7f4fa39dce72be75a79df7fc971284e4f793c5655efddfe7cd6fdb04880980f51e0626730674880ac413c2c43340f89838dd33c5a019bdd95899901d3b949885c8a96b01bb2f9c0ea2647d9290967ad49d385a54976e568dcc10505d2e6d30fa3f828312d3a21a81e940a3981cd9f71fa0ad2fef6da9de31adb57fd906d5646abca90495580c94f3e9ca0f52b193b316e8bfc3f346d78b6920172d34e57f75d061d438c2424bfa8d759095e55c4bab8125ba5d07f13342b8a96a8a3ce2d4e1bd6aa78021c9df2ae3ddc572dba97e2e7d66e629886e5ca92248160f289dc1df6a6c39bb09369e203308124df04f57bf6b7167a56637b2c5682175d7c492bdd52c8f0ec734577201fd03d5772335cad30e1f3df9e63325c3baac1438780b58c914a7e7a26f43d626dd67cc15f59bd4ccc9a1e9d85b0a4837a81f0aec68b007e94d6a249873d5dc894ad28889f139f0ea1e953dcec3c3b82ffef9f9f6f00dcb13748ae5715a3eb7c298de78957dbd37c895b8c48d684a2fb8831665ed345e5acee889a9081df80e58d60ba34f4fe6d662a5081eafb133f2956dbff0f20aa363ed77271020b88b663075463b2c24d1d4c6ee671273bc7b4e395521fd95f116f54576f1a0aeb000837f71b624e90dc6b17584d3f225aa3e3bccb7897bfe9912f27ddb4b2f18707a0538b812e6b0129b262f756e91beba0a13ddbe8002a6a19e472828791d184c47bc41443360494b268336488326fce8f00cfc94d5701b77980f684b3222ab77fe527ecc41e6fdac8edc63edb911a6fbc63966fe60620a3448016ce98851bbdc7dd4e2c230e352e4eb7a4754128ace4bca8cde70bdd79b75e40eaf8999d308d79b3fb4e1277f21b80e6ed73b5ac6f48d8c712fa34583f2223ba35cb7aef894183b668a4a45870bb0fc31a1b50b41f6b496e10a8f1e8d550367d56ddb10179f555543d04e849c8f39bc56f275a6e5eb16df6b888c4bc09ab6329c5c8f2b099cad0d4b7a9d1fd113e801a2a9fbf793bbaaf55efdadae36cbb47cbc4bebfc5df4945fe05619f91f1617cfe0ad55d44cc78ef29858b6c7ddb1ed27546552acbdb91afb06536e552d656827b66c653a166e4e0a800732bb18d73f0e7c7b0788edef39ce3f0430a2ff4487828f6354688110119693bd1f19d040c4533ceb2e97';

if (!GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error('No GOOGLE_APPLICATION_CREDENTIALS');
}

const decryptedCredentials = decrypt(encryptedGoogleCredentials, GOOGLE_APPLICATION_CREDENTIALS);

const credentials = JSON.parse(Buffer.from(decryptedCredentials, 'base64').toString());
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
