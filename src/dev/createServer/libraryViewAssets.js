import * as path from 'path';
import serveStatic from 'serve-static';

const libraryViewBuild = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'libraryView',
  'www',
  'build',
  'app',
);

export default serveStatic(libraryViewBuild, {
  fallthrough: false,
});
