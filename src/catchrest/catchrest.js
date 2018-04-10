import chalk from 'chalk';

export default function publish(arg) {
  // eslint-disable-next-line no-console
  console.log(
    chalk.hex('#FD4063')('%s is an unknown command.') +
      chalk.hex('#5EFFA9')(
        '\nDo you want to see it working?\nLet us know here ',
      ) +
      chalk.hex('#4EB9FD')('https://github.com/patternsonio/cli/issues/new'),
    arg,
  );
}
