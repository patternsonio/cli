/* eslint-disable import/first */

import './polyfills';
import program from 'commander';
import update from 'update-notifier';
import draftlog from 'draftlog';
import * as pkg from '../../package.json';
import { yellow, pink } from '../colors';

// eslint-disable-next-line no-console
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
  .action(async (c) => {
    const { default: publish } = await import('../publish');

    return publish(c);
  });

program
  .command('access')
  .description('check access rights of current user')
  .action(async (c) => {
    const { default: checkAccess } = await import('../access');

    try {
      console.log(await checkAccess(c));
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });

program
  .command('dev')
  .description('start development environment')
  .action(async (c) => {
    const serverMsg = console.draft(pink('starting dev-server...'));
    const { default: dev } = await import('../dev');

    try {
      await dev(c, serverMsg);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });

program.command('*').action(async (c) => {
  const { default: catchRest } = await import('../catchrest');

  return catchRest(c);
});

program.parse(process.argv);
