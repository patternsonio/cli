import '@patternson/octopus';
import { Component, Prop, Element, State } from '@stencil/core';
import stringifyAttributes from 'stringify-attributes';
import pretty from 'pretty';
import escape from 'escape-html';
import Prism from 'prismjs';

interface Prop {
  name: string;
  type: string;
  attr: string;
  docs: string;
}

interface ParsedComponent {
  props: [Prop];
}

@Component({
  tag: 'tag-page',
  styleUrl: 'TagPage.css',
})
export class TagPage {
  @Element() elm: HTMLElement;
  @Prop() component: string;
  @Prop() name: string;
  @Prop() tag: string;
  @Prop() backlink: string;
  @Prop() version: string;
  @State() demoContent: string;
  @State() demoProps: object;
  private parsedComponent: ParsedComponent;
  getCode() {
    return Prism.highlight(
      pretty(
        `<${this.tag}${stringifyAttributes(this.demoProps || {})}>${this
          .demoContent || ''}</${this.tag}>`,
        {
          ocd: true,
        },
      ).trim(),
      Prism.languages.html,
      'html',
    );
  }
  setContent = (ev) => {
    this.demoContent = ev.target.value;
  };
  setDemoAttribute = (ev) => {
    this.demoProps = {
      ...this.demoProps,
      [ev.detail.attr]: ev.detail.value,
    };
  };
  componentWillLoad() {
    console.log('will load');
    this.parsedComponent = JSON.parse(atob(this.component));
  }
  componentWillUpdate() {
    this.parsedComponent = JSON.parse(atob(this.component));
  }
  render() {
    return (
      <op-frame>
        <op-header>
          <a href={this.backlink}>Back</a>
          <op-headline>{this.tag}</op-headline>
        </op-header>
        <op-content>
          <op-headline level={3}>Demo</op-headline>
          <component-demo
            tag={this.tag}
            content={this.demoContent}
            props={this.demoProps}
          />
          <op-headline level={3}>Code</op-headline>
          <code innerHTML={this.getCode()} />
          <op-headline level={3}>Content</op-headline>
          <label htmlFor="demo-content">
            <textarea id="demo-content" onKeyUp={this.setContent} />
          </label>
          {this.parsedComponent.props.length > 0 ? (
            <op-headline level={3}>Props</op-headline>
          ) : null}
          {this.parsedComponent.props.map(({ name, type, attr }) => {
            const id = `prop-${name}`;
            return (
              <label htmlFor={id}>
                {name}
                <prop-input
                  type={type}
                  id={id}
                  attr={attr}
                  onNewValue={this.setDemoAttribute}
                />
              </label>
            );
          })}
        </op-content>
      </op-frame>
    );
  }
}
