import gql from 'graphql-tag';
import Client from '@patternson/registry-client';
import getConfig from '../getConfig';

const query = gql`
  query Access($name: String!) {
    access(name: $name) {
      publish
    }
  }
`;

export default function access({ options }) {
  const { accessToken, registryUrl, name } = getConfig(options);

  const client = new Client({
    accessToken,
    registryUrl,
    disableOffline: true,
  });

  return client
    .query({
      query,
      variables: { name },
    })
    .then((resp) => {
      return {
        publish: resp.data.access.publish,
      };
    });
}
