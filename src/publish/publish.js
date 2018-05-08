import fetch from 'node-fetch';
import Client from '@patternson/registry-client';
import gql from 'graphql-tag';
import getConfig from '../getConfig';
import monitorPublish from './monitorPublish';
import zipComponents from './zipComponents';
import PublishLog, { STATE_DONE, STATE_PROGRESS } from './PublishLog';

const uploadUrlQuery = gql`
  query getUploadUrl($name: String!, $version: String!) {
    uploadUrl(name: $name, version: $version)
  }
`;

export default async function publish({ options }) {
  const log = new PublishLog();

  try {
    const {
      accessToken,
      registryUrl,
      name,
      version,
      rootDir,
      componentsDir,
    } = getConfig(options);

    log.setState({
      name,
      version,
    });

    const client = new Client({
      accessToken,
      registryUrl,
      disableOffline: true,
    });

    const {
      data: { uploadUrl },
    } = await client.query({
      query: uploadUrlQuery,
      variables: {
        name,
        version,
      },
    });

    const zip = await zipComponents({ rootDir, componentsDir });

    log.setSteps({
      prepare: STATE_DONE,
      upload: STATE_PROGRESS,
    });

    const { status, statusText } = await fetch(uploadUrl, {
      method: 'PUT',
      body: zip,
    });

    if (status !== 200) {
      throw new Error(`ERR: upload failed with ${status} - ${statusText}`);
    }

    await monitorPublish({ client, name, version, log });
  } catch (err) {
    log.error(err);
  }
}
