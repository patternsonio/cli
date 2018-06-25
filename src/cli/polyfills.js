const runtime = require('babel-runtime/regenerator');
const fs = require('fs');

// Prevent other libs from using experimental API and causing a warning
// TODO: remove once fs.promises is stable
delete fs.promises;

global.regeneratorRuntime = global.regeneratorRuntime || runtime;
