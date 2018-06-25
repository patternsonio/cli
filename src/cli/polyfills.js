const runtime = require('babel-runtime/regenerator');
const fs = require('fs');

// Prevent other libs from using experimental API and causing a warning
// TODO: remove once fs.promises is stable
delete fs.promises;

process.on('unhandledRejection', (reason) => {
  // TODO: find out what is causing this rejection and remove this workaround
  // Probably s.th. with typescript + virtual file system
  if (
    reason ===
    'The "path" argument must be of type string. Received type object'
  ) {
    return;
  }
  // eslint-disable-next-line no-console
  console.error(reason, reason.stack);
  process.exit(1);
});

global.regeneratorRuntime = global.regeneratorRuntime || runtime;
