import * as path from 'path';
import AdmZip from 'adm-zip';

export default function zipComponents({ rootDir, componentsDir }) {
  const absComponentsDir = path.resolve(rootDir, componentsDir);

  const zip = new AdmZip();

  zip.addLocalFolder(absComponentsDir, 'components');

  return zip.toBuffer();
}
