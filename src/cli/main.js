/* eslint-disable import/first */

import './polyfills';

import program from 'commander';
import update from 'update-notifier';
import draftlog from 'draftlog';
import * as pkg from '../../package.json';
import publish from '../publish';
import catchrest from '../catchrest';
import { yellow } from '../colors';

console.log(yellow(`${pkg.name} v${pkg.version}`));

draftlog.into(console);

update({ pkg }).notify();

program
  .version(pkg.version, '-v, --version')
  .option('--accessToken', 'authentication token for registry')
  .option('--registryUrl', 'http endpoint of the used patternson registry');

program
  .command('publish')
  .description('publish the current version of a patternson library')
  .action(publish);

program.command('*').action(catchrest);

program.parse(process.argv);
