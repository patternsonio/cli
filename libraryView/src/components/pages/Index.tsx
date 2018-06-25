import { Component, Prop } from '@stencil/core';
import '@patternson/octopus';

@Component({
  tag: 'index-page',
})
export class Index {
  @Prop() components: string;
  @Prop() name: string;
  @Prop() basetagurl: string;
  @Prop() version: string;
  render() {
    const components = JSON.parse(atob(this.components));

    return (
      <op-frame>
        <op-header>
          <op-headline level={2}>{`${this.name}@${this.version}`}</op-headline>
        </op-header>
        <op-content>
          <op-headline level={2}>Components</op-headline>
          {components.map((tag) => {
            return (
              <op-card key={tag}>
                <op-label>{tag}</op-label>

                <br />
                <op-button nomargin href={`${this.basetagurl}/${tag}`}>
                  More Info
                </op-button>
              </op-card>
            );
          })}
        </op-content>
      </op-frame>
    );
  }
}
