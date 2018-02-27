'use strict';

const program = require('commander');
const pkg = require('../../package');
const update = require('update-notifier');

const publish = require('../publish');

update({ pkg }).notify();

program
  .version(pkg.version, '-v, --version')
  .option('--authToken', 'authentication token for registry')
  .option('--registryUrl', 'http endpoint of the used patternson registry');

program
  .command('publish')
  .description('publish the current version of a patternson library')
  // .option('-r, --recursive', 'Remove recursively')
  .action(publish);

program.parse(process.argv);
