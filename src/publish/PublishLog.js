import { dots as spinner } from 'cli-spinners';
import { blue, pink, green, red, yellow } from '../colors';

export const STATE_PENDING = 'PENDING';
export const STATE_PROGRESS = 'PROGRESS';
export const STATE_DONE = 'DONE';
export const STATE_ERROR = 'ERROR';

const stateColor = {
  [STATE_PENDING]: pink,
  [STATE_PROGRESS]: blue,
  [STATE_DONE]: green,
  [STATE_ERROR]: red,
};

let progress = 0;
function getProgress() {
  const icon = spinner.frames[progress];

  if (spinner.frames[progress + 1]) {
    progress += 1;
  } else {
    progress = 0;
  }

  return yellow(icon);
}

const stateIcon = {
  [STATE_PENDING]: yellow('»'),
  [STATE_PROGRESS]: getProgress,
  [STATE_DONE]: green('✔'),
  [STATE_ERROR]: red('✘'),
};

export default class PublishLog {
  constructor() {
    this.state = {};
    this.steps = {
      prepare: STATE_PROGRESS,
      upload: STATE_PENDING,
      compile: STATE_PENDING,
      createNewTags: STATE_PENDING,
      moveToCdn: STATE_PENDING,
      updateTags: STATE_PENDING,
      finished: STATE_PENDING,
    };
    this.headLine = console.draft(this.getHeadline());
    this.stepLine = console.draft(this.getSteps());
    this.queueUpdateSteps();
  }
  updateHeadline() {
    this.headLine(this.getHeadline());
  }
  updateSteps() {
    this.stepLine(this.getSteps());

    const hasProgress = Object.keys(this.steps).find((key) => {
      return this.steps[key] === STATE_PROGRESS;
    });

    if (hasProgress) {
      this.queueUpdateSteps();
    }
  }
  setState(state) {
    this.state = {
      ...this.state,
      ...state,
    };
    this.updateHeadline();
  }
  setSteps(steps) {
    this.steps = {
      ...this.steps,
      ...steps,
    };
    this.updateSteps();
  }
  queueUpdateSteps() {
    if (!this.next) {
      this.next = true;

      setTimeout(() => {
        this.next = false;
        this.updateSteps();
      }, spinner.interval);
    }
  }
  error(err) {
    Object.keys(this.steps).forEach((key) => {
      if (this.steps[key] === STATE_PROGRESS) {
        this.steps[key] = STATE_ERROR;
      }
    });
    this.updateSteps();
    console.log(red(`ERR: ${err.message.length ? err.message : 'Unknown'}\n`));
    process.exit(1);
  }
  getHeadline() {
    return this.state.name && this.state.version
      ? blue(`publishing ${this.state.name}@${this.state.version}`)
      : blue('publihsing...');
  }
  getSteps() {
    return Object.keys(this.steps)
      .map((step) => {
        const color = stateColor[this.steps[step]];
        const icon = stateIcon[this.steps[step]];

        return [typeof icon === 'function' ? icon() : icon, color(step)].join(
          ' ',
        );
      })
      .join(' ');
  }
}
