/* eslint-disable import/first */

import './polyfills';

import program from 'commander';
import update from 'update-notifier';
import * as pkg from '../../package.json';
import publish from '../publish';
import catchrest from '../catchrest';

update({ pkg }).notify();

program
  .version(pkg.version, '-v, --version')
  .option('--authToken', 'authentication token for registry')
  .option('--registryUrl', 'http endpoint of the used patternson registry');

program
  .command('publish')
  .description('publish the current version of a patternson library')
  .action(publish);

program.command('*').action(catchrest);

program.parse(process.argv);
