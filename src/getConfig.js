'use strict';

const path = require('path');
const rc = require('rc');
const readPkgUp = require('read-pkg-up');

const pkgResult = readPkgUp.sync();
const rootDir = path.dirname(pkgResult.path);

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
  return Object.assign({}, rcConfig, extra);
};
