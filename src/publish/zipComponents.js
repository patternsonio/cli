import * as path from 'path';
import Archiver from 'archiver';

export default function zipComponents({ rootDir, componentsDir }) {
  const absComponentsDir = path.resolve(rootDir, componentsDir);

  const zip = new Archiver('zip');

  zip.directory(absComponentsDir, 'components');
  zip.finalize();

  return new Promise((resolve, reject) => {
    const bufs = [];
    zip.on('data', (d) => {
      bufs.push(d);
    });
    zip.on('err', reject);
    zip.on('end', () => {
      resolve(Buffer.concat(bufs));
    });
  });
}
