export default function createWatcher(
  originalCreateWatcher,
  vComponentsRgx,
  componentsDir,
  vComponentsDir,
) {
  return (events, paths, opts) => {
    const componentsRgx = new RegExp(`^${componentsDir}`);
    const mapParams = (event, params) => {
      switch (event) {
        case 'fileUpdate':
        case 'fileAdd':
        case 'fileDelete':
        case 'dirAdd':
        case 'dirDelete':
          if (componentsRgx.test(params)) {
            return params.replace(componentsRgx, vComponentsDir);
          }
          return params;
        default:
          return params;
      }
    };

    if (vComponentsRgx.test(paths)) {
      const originalEmit = events.emit;

      // eslint-disable-next-line no-param-reassign
      events.emit = (event, params) => {
        originalEmit.call(events, event, mapParams(event, params));
      };

      originalCreateWatcher(
        events,
        paths.replace(vComponentsRgx, componentsDir),
        opts,
      );
    }
  };
}
