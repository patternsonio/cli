import chalk from 'chalk';
import fetch from 'node-fetch';
import getConfig from '../getConfig';
import getUploadUrl from './getUploadUrl';
import zipComponents from './zipComponents';

export default async function publish(cmd) {
  try {
    const config = getConfig(cmd.options);

    const [url, zip] = await Promise.all([
      getUploadUrl(config),
      zipComponents(config),
    ]);

    const res = await fetch(url, {
      method: 'PUT',
      body: zip,
    });

    if (res.status !== 200) {
      throw new Error(
        `ERR: upload failed with ${res.status} - ${res.statusText}`,
      );
    }

    process.stdout.write(chalk.hex('#5EFFA9')('Upload OK!\n'));
  } catch (err) {
    process.stderr.write(
      chalk.hex('#FD4063')(
        `ERR: ${err.message.length ? err.message : 'Unknown'}\n`,
      ),
    );
    process.exit(1);
  }
}
