export default {
  enable: true,

  info(...msg) {
    // if (this.enable) {
    //   console.log(...msg);
    // }
  },
  warn(...msg) {
    if (this.enable) {
      console.warn(...msg);
    }
  },
  error(...msg) {
    if (this.enable) {
      console.error(...msg);
    }
  },
  debug(...msg) {
    // if (this.enable) {
    //   console.log.apply(console, msg);
    // }
  },
  color(_msg, _color) {
    /* */
  },
  red(msg) {
    return msg;
  },
  green(msg) {
    return msg;
  },
  yellow(msg) {
    return msg;
  },
  blue(msg) {
    return msg;
  },
  magenta(msg) {
    return msg;
  },
  cyan(msg) {
    return msg;
  },
  gray(msg) {
    return msg;
  },
  bold(msg) {
    return msg;
  },
  dim(msg) {
    return msg;
  },
  createTimeSpan(_startMsg, _debug = false) {
    return {
      finish: () => {
        /* finish */
      },
    };
  },
  printDiagnostics(_diagnostics) {
    /* */
  },
  buildLogFilePath: null,
  writeLogs(_) {
    /**/
  },
};
