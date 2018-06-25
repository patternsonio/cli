import { dots as spinner } from 'cli-spinners';
import { blue, green, red, yellow } from '../colors';

class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = (arg) => {
        this.pending = false;
        resolve(arg);
      };
      this.reject = (arg) => {
        this.pending = false;
        reject(arg);
      };
    });
    this.pending = true;
  }
}

let progress = 0;
function getProgressMsg() {
  const icon = spinner.frames[progress];

  if (spinner.frames[progress + 1]) {
    progress += 1;
  } else {
    progress = 0;
  }

  return ` ${yellow(icon)} ${blue('compiling intensifies...')}`;
}

export default function compileStatus(compilerEvents) {
  let compilations = 0;
  let compiling = false;
  let done = new Deferred();
  let update = null;

  compilerEvents.subscribe('buildStart', () => {
    if (!done.pending) {
      done = new Deferred();
    }
    if (!compiling) {
      if (!update) {
        update = console.draft(getProgressMsg());
      }
      const ivl = setInterval(() => {
        update(getProgressMsg());
      }, spinner.interval);
      compiling = (msg) => {
        clearInterval(ivl);
        update(msg);
      };
    }
    compilations += 1;
  });

  compilerEvents.subscribe('buildFinish', () => {
    compilations -= 1;

    if (compilations === 0) {
      done.resolve();
      compiling(
        `👌 ${green('compiling done.')} ${yellow('Waiting for changes...')}`,
      );
      compiling = false;
    }
  });

  return {
    err(err) {
      done.reject(err);
      if (compiling) {
        compiling(`${red(err.message)}`);
        compiling = false;
      }
    },
    done() {
      return done.promise;
    },
  };
}
