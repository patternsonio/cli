import path from 'path';
import rc from 'rc';
import readPkgUp from 'read-pkg-up';

const pkgResult = readPkgUp.sync();
const rootDir = path.dirname(pkgResult.path);

function addSlash(thing) {
  return thing.match(/\/$/) ? thing : `${thing}/`;
}

const rcConfig = rc('patternson', {
  registryUrl: 'https://reg.patternson.io',
  rootDir,
  componentsDir: 'src/components',
  name: pkgResult.pkg.name,
  version: pkgResult.pkg.version,
  ...pkgResult.pkg.patternson,
});

export default function getConfig(extra) {
  const config = { ...rcConfig, ...extra };

  return {
    ...config,
    registryUrl: addSlash(config.registryUrl),
  };
}
