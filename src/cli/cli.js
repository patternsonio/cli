#!/usr/bin/env node
/* eslint-disable global-require, import/no-dynamic-require */

'use strict';

const importLocalFile = require('import-local-file');

const localFile = importLocalFile(__filename);
if (localFile) {
  console.log('> Using local installed version of @patternson/cli');
  require(localFile);
} else {
  require('./main');
}
