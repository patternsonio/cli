import * as path from 'path';
import { Compiler } from '@stencil/core/compiler';
import getConfig from '../getConfig';
import getStencilConfig from './getStencilConfig';
import createServer from './createServer';
import compileStatus from './compileStatus';

export default function dev({ options }, serverMsg) {
  const config = getConfig(options);
  const rootDir = '/<v-root>';
  const componentsDir = path.join(rootDir, '<components>');

  const stencilConfig = getStencilConfig(config, rootDir, componentsDir);
  const compiler = new Compiler(stencilConfig);
  const status = compileStatus(compiler.ctx.events);
  const server = createServer(config, stencilConfig.sys.fs, status, serverMsg);

  server.start();
  compiler.build();
}
