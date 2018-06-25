/* eslint-disable no-cond-assign */
import connect from 'connect';
import * as http from 'http';
import findFreePort from 'find-free-port';
import { pink, blue } from '../../colors';
import demoApp from './demoApp';
import waitForCompile from './waitForCompile';
import libraryViewAssets from './libraryViewAssets';
import patternsonAssets from './patternsonAssets';

export default function createServer(config, fs, status, serverMsg) {
  const app = connect();

  app
    .use('/_library_view', libraryViewAssets)
    .use(waitForCompile(status))
    .use('/_patternson', patternsonAssets(fs))
    .use(demoApp(fs, config))
    // eslint-disable-next-line no-unused-vars
    .use((err, req, res, next) => {
      // eslint-disable-next-line no-console
      console.error(err);
      res.statusCode = 500;
      res.end('Server Error');
    });

  const server = http.createServer(app);

  return {
    start() {
      findFreePort(1337, (err, port) => {
        if (err) {
          status.err(err);
          return;
        }

        server.listen(port, (listenErr) => {
          if (listenErr) {
            status.err(listenErr);
            return;
          }
          // eslint-disable-next-line no-console
          serverMsg(
            `${pink('dev-environment ready on ')}${blue(
              `http://localhost:${port}`,
            )}`,
          );
        });
      });
    },
  };
}
