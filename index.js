require('./lib/cli/polyfills');
require('draftlog').into(console);
const publish = require('./lib/publish').default;
const access = require('./lib/access').default;

module.exports = {
  publish,
  access,
};
