'use strict';

const chalk = require('chalk');

const log = console.log;

module.exports = function publish(cb) {
  log(
    chalk.hex('#FD4063')('%s is an unknown command.') +
      chalk.hex('#5EFFA9')(
        '\nDo you want to see it working?\nLet us know here '
      ) +
      chalk.hex('#4EB9FD')('https://github.com/patternsonio/cli/issues/new'),
    cb
  );
};
