require('./lib/cli/polyfills');
require('draftlog').into(console);
const publish = require('./lib/publish').default;

module.exports = {
  publish,
};
