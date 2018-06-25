import { Component, Prop } from '@stencil/core';
import 'octopus';

@Component({
  tag: 'not-found',
})
export class NotFound {
  @Prop() components: string;
  render() {
    return (
      <op-frame>
        <op-header>
          <op-headline level={2}>Not Found</op-headline>
        </op-header>
      </op-frame>
    );
  }
}
