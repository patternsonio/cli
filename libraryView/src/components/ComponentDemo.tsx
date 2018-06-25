import { Component, Prop, Element } from '@stencil/core';

@Component({
  tag: 'component-demo',
})
export class ComponentDemo {
  @Prop() tag: string;
  @Element() elm: HTMLElement;
  @Prop({ context: 'isServer' })
  private isServer: boolean;
  @Prop() content: string;
  @Prop() props: object;
  demoElement: HTMLElement;
  demoContentSlot: HTMLElement;
  private mounted: boolean;
  private prevContent: string = '';
  private prevProps: object = {};
  setIframeSize(iFrame, portal, body) {
    const setSize = () => {
      if (portal.scrollHeight !== body.clientHeight) {
        iFrame.setAttribute('height', portal.scrollHeight);
      }
      if (portal.scrollWidth !== body.clientWidth) {
        iFrame.setAttribute('width', portal.scrollWidth);
      }

      if (this.mounted) {
        iFrame.contentWindow.requestAnimationFrame(setSize);
      }
    };

    iFrame.contentWindow.requestAnimationFrame(setSize);
  }
  componentDidUnload() {
    this.mounted = false;
  }
  componentDidUpdate() {
    const newContent = this.content || '';
    if (this.prevContent !== newContent) {
      this.demoContentSlot.innerHTML = newContent;
    }

    this.prevContent = newContent;

    if (this.props === this.prevProps) {
      return;
    }

    Object.keys(this.props).forEach((key) => {
      if (this.prevProps[key] !== this.props[key]) {
        if (!this.props[key]) {
          this.demoElement.removeAttribute(key);
        } else {
          this.demoElement.setAttribute(key, this.props[key]);
        }
      }
    });

    this.prevProps = this.props;
  }
  componentDidLoad() {
    if (this.isServer) {
      return;
    }
    this.mounted = true;
    const iFrame = this.elm.querySelector('iframe');
    const iFrameDocument = iFrame.contentDocument;
    const { body } = iFrameDocument;
    const script = iFrameDocument.createElement('script');
    const portal = iFrameDocument.createElement('div');
    this.demoElement = iFrameDocument.createElement(this.tag);
    this.demoContentSlot = iFrameDocument.createElement('demo-slot');
    this.demoElement.appendChild(this.demoContentSlot);
    portal.appendChild(this.demoElement);

    body.style.margin = '0';
    portal.style.display = 'inline-block';
    script.src = `/_patternson/dev.js`;

    iFrameDocument.head.appendChild(script);
    body.appendChild(portal);
    this.setIframeSize(iFrame, portal, body);
    this.componentDidUpdate();
  }
  render() {
    return <iframe frameBorder="0" width="0" height="0" scrolling="no" />;
  }
}
