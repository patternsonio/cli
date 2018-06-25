import { Component, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'prop-input',
})
export class PropInput {
  @Prop() type: string;
  @Prop() attr: string;
  @Prop() disabled: boolean;
  @Prop() id: string;
  @Event() newValue: EventEmitter;
  private getValue(target) {
    switch (this.type) {
      case 'boolean':
        return target.checked;
      default:
        return target.value;
    }
  }
  private onChange = (ev) => {
    this.newValue.emit({ value: this.getValue(ev.target), attr: this.attr });
  };
  render() {
    switch (this.type) {
      case 'boolean':
        return (
          <input
            id={this.id}
            type="checkbox"
            onChange={this.onChange}
            disabled={this.disabled}
          />
        );
      default:
        return (
          <input
            id={this.id}
            type="text"
            onKeyUp={this.onChange}
            disabled={this.disabled}
          />
        );
    }
  }
}
