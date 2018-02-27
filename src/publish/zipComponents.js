'use strict';

const path = require('path');
const AdmZip = require('adm-zip');

module.exports = function zipComponents(config) {
  const componentsDir = path.resolve(config.rootDir, config.componentsDir);

  const zip = new AdmZip();

  zip.addLocalFolder(componentsDir, 'components');

  return Promise.resolve(zip.toBuffer());
};
