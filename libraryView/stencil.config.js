exports.config = {
  rootDir: __dirname,
  namespace: `patternson_cli_demo`,
  // enableCache: false,
  fsNamespace: 'app',
  outputTargets: [
    {
      serviceWorker: false,
      resourcesUrl: '/_library_view/',
      type: 'www',
    },
  ],
};
