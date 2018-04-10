import * as path from 'path';
import AdmZip from 'adm-zip';

export default function zipComponents(config) {
  const componentsDir = path.resolve(config.rootDir, config.componentsDir);

  const zip = new AdmZip();

  zip.addLocalFolder(componentsDir, 'components');

  return zip.toBuffer();
}
