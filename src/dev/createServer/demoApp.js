/* eslint-disable no-cond-assign */
import { Renderer, loadConfig } from '@stencil/core/server';
import { parse } from 'url';
import pathMatch from 'path-match';
import stringifyAttributes from 'stringify-attributes';
import { config as stencilBaseConfig } from '../../../libraryView/stencil.config';

const route = pathMatch();
const indexRoute = route('/');
const tagRoute = route('/tag/:tag');

function objectToBase64(object) {
  return Buffer.from(JSON.stringify(object)).toString('base64');
}

export default function demoApp(fs, patternsonConfig) {
  const config = loadConfig({
    ...stencilBaseConfig,
    flags: {
      ...stencilBaseConfig.flags,
      ssr: true,
    },
  });

  return async (req, res, next) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      const renderer = new Renderer(config);
      const docs = JSON.parse(fs.readFileSync('/<v-root>/docs.json'));
      const stats = JSON.parse(fs.readFileSync('/<v-root>/stencil-stats.json'));

      let params = null;
      let component = null;
      let statusCode = 200;

      if (
        (params = tagRoute(pathname)) &&
        stats.components.find(({ tag }) => tag === params.tag)
      ) {
        params.component = objectToBase64({
          ...stats.components.find(({ tag }) => tag === params.tag),
          ...docs.components.find(({ tag }) => tag === params.tag),
        });
        params.backlink = '/';

        statusCode = 200;
        component = 'tag-page';
      } else if (indexRoute(pathname)) {
        params = {
          components: objectToBase64(
            stats.components.map(({ tag }) => {
              return tag;
            }),
          ),
          basetagurl: '/tag',
        };
        statusCode = 200;
        component = 'index-page';
      } else {
        statusCode = 404;
        component = 'not-found';
      }

      const result = await renderer.hydrate({
        req,
        html: `
      <script src="_library_view/app.js"></script>
      <${component}${stringifyAttributes({
          ...(params || {}),
          name: patternsonConfig.name,
          version: patternsonConfig.version,
        })}></${component}>`,
      });

      if (result.diagnostics && result.diagnostics.length) {
        res.statusCode = 500;
        res.end('Server Error');
        // eslint-disable-next-line no-console
        console.error(result.diagnostics[0].messageText);
      } else {
        res.statusCode = statusCode;
        res.end(result.html);
      }
    } catch (e) {
      next(e);
    }
  };
}
