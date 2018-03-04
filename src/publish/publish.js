'use strict';

const getConfig = require('../getConfig');
const getUploadUrl = require('./getUploadUrl');
const zipComponents = require('./zipComponents');
// const monitorCompiler = require('./monitorCompiler');
const chalk = require('chalk');
const fetch = require('node-fetch');

module.exports = function publish(cmd) {
  const config = getConfig(cmd.options);

  return (
    Promise.all([getUploadUrl(config), zipComponents(config)])
      .then((result) => {
        const url = result[0];
        const zip = result[1];

        return fetch(url, {
          method: 'PUT',
          body: zip,
        }).then((res) => {
          if (res.status !== 200) {
            return Promise.reject(
              new Error(
                `ERR: upload failed with ${res.status} - ${res.statusText}`
              )
            );
          }

          return Promise.resolve();
        });
      })
      .then(() => {
        process.stdout.write(chalk.hex('#5EFFA9')('Upload OK!\n'));
        // process.stdout.write(
        //   chalk.dim('Monitoring compiler (CTRL+C to abort)\n')
        // );
      })
      // .then(() => {
      //   return monitorCompiler(config);
      // })
      .catch((err) => {
        process.stderr.write(
          chalk.hex('#FD4063')(
            `ERR: ${err.message.length ? err.message : 'Unknown'}\n`
          )
        );
        process.exit(1);
      })
  );
};
