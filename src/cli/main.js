/* eslint-disable import/first */

import './polyfills';

import program from 'commander';
import update from 'update-notifier';
import draftlog from 'draftlog';
import * as pkg from '../../package.json';
import publish from '../publish';
import checkAccess from '../access';
import catchrest from '../catchrest';
import { yellow } from '../colors';

console.log(yellow(`${pkg.name} v${pkg.version}`));

draftlog.into(console);

update({ pkg }).notify();

program
  .version(pkg.version, '-v, --version')
  .option(
    '--accessToken <token>',
    'authentication token for patternson registry',
  )
  .option('--name <name>', 'name of the component library')
  .option('--version <version>', 'version of the component library')
  .option(
    '--componentsDir <dir>',
    'directory where all components can be found',
  )
  .option('--rootDir <dir>', 'root directory of the local library')
  .option(
    '--registryUrl <url>',
    'http endpoint of the patternson registry\n\nSee https://github.com/patternsonio/cli#config for other ways to configure the cli\n',
  );

program
  .command('publish')
  .description('publish the current version of a patternson library')
  .action(publish);

program
  .command('access')
  .description('check access rights of current user')
  .action(async (c) => {
    try {
      console.log(await checkAccess(c));
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });

program.command('*').action(catchrest);

program.parse(process.argv);
