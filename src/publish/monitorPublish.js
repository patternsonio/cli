import gql from 'graphql-tag';
import { STATE_DONE, STATE_PROGRESS } from './PublishLog';

const libraryVersionSubscription = gql`
  subscription LibraryVersion($name: String, $version: String) {
    libraryVersion(name: $name, version: $version) {
      error
      getSourceFiles
      compile
      createNewTags
      moveToCdn
      updateTags
      finished
      docVersion
    }
  }
`;

export default async function monitorPublish({ client, name, version, log }) {
  return client
    .subscribe({
      query: libraryVersionSubscription,
      variables: {
        name,
        version,
      },
    })
    .then((obs) => {
      return new Promise((resolve, reject) => {
        let latestDocVersion = -1;
        const subscription = obs.subscribe({
          next({ data: { libraryVersion } }) {
            const {
              getSourceFiles,
              docVersion,
              finished,
              error,
            } = libraryVersion;

            if (
              log.steps.upload === STATE_PROGRESS &&
              getSourceFiles === STATE_DONE
            ) {
              log.setSteps({
                upload: STATE_DONE,
              });
            }

            if (latestDocVersion >= docVersion) {
              return;
            }

            log.setSteps(
              Object.keys(libraryVersion).reduce((memo, key) => {
                if (log.steps[key]) {
                  return {
                    ...memo,
                    [key]: libraryVersion[key],
                  };
                }

                return memo;
              }, {}),
            );

            if (finished === STATE_DONE) {
              subscription.unsubscribe();
              resolve();
            }

            if (error) {
              log.error({ message: error });
            }

            latestDocVersion = docVersion;
          },
          error(err) {
            reject(err);
            log.error(err);
          },
        });
      });
    });
}
