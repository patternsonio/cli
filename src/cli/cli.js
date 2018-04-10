#!/usr/bin/env node

import importLocalFile from 'import-local-file';

const localFile = importLocalFile(__filename);
if (localFile) {
  // eslint-disable-next-line no-console
  console.log('> Using local installed version of @patternson/cli');
  import(localFile);
} else {
  import('./main');
}
