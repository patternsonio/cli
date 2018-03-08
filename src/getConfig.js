'use strict';

const path = require('path');
const rc = require('rc');
const readPkgUp = require('read-pkg-up');

const pkgResult = readPkgUp.sync();
const rootDir = path.dirname(pkgResult.path);

function addSlash(thing) {
  return thing.match(/\/$/) ? thing : `${thing}/`;
}

const rcConfig = rc(
  'patternson',
  Object.assign(
    {
      registryUrl: 'https://reg.patternson.io',
      rootDir,
      componentsDir: 'src/components',
      name: pkgResult.pkg.name,
      version: pkgResult.pkg.version,
    },
    pkgResult.pkg.patternson || {}
  )
);

module.exports = function getConfig(extra) {
  const config = Object.assign({}, rcConfig, extra);

  return Object.assign(config, {
    registryUrl: addSlash(config.registryUrl),
  });
};
