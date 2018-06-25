import { loadConfig } from '@stencil/core/server';
import * as path from 'path';
import virtualFileSystem from './fs';
import createWatcher from './createWatcher';
import logger from './logger';

export default function getStencilConfig(config, vRootDir, vComponentsDir) {
  const nodeModulesDir = path.join(config.rootDir, 'node_modules');
  const componentsDir = path.resolve(config.rootDir, config.componentsDir);
  const vComponentsRgx = new RegExp(`^${vComponentsDir}`);

  const vfs = virtualFileSystem(vComponentsRgx, componentsDir, nodeModulesDir);

  const stencilConfig = loadConfig({
    flags: {
      docs: true,
      stats: true,
      watch: true,
    },
    srcDir: vComponentsDir,
    namespace: `patternson_dev`,
    enableCache: false,
    fsNamespace: 'dev',
    rootDir: vRootDir,
    outputTargets: [
      {
        type: 'www',
      },
      {
        type: 'docs',
        jsonFile: 'docs.json',
      },
    ],
    hashedFileNameLength: 12,
    // suppressTypeScriptErrors: true,
  });

  vfs.mkdir(`${vRootDir}/.stencil`);
  // vfs.writeFileSync(
  //   `${vRootDir}/tsconfig.json`,
  //   JSON.stringify({
  //     compilerOptions: {
  //       allowSyntheticDefaultImports: true,
  //       allowUnreachableCode: false,
  //       declaration: false,
  //       experimentalDecorators: true,
  //       // lib: ['dom', 'es2015', 'esnext.asynciterable'],
  //       moduleResolution: 'node',
  //       module: 'es2015',
  //       target: 'es2015',
  //       noUnusedLocals: true,
  //       noUnusedParameters: true,
  //       jsx: 'react',
  //       jsxFactory: 'h',
  //     },
  //   }),
  // );
  stencilConfig.sys.fs = vfs;

  stencilConfig.sys.createWatcher = createWatcher(
    stencilConfig.sys.createWatcher,
    vComponentsRgx,
    componentsDir,
    vComponentsDir,
  );

  stencilConfig.logger = logger;

  return stencilConfig;
}
