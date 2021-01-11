import { Component, Prop, Element, h } from '@stencil/core';

@Component({
  tag: 'x-spacer',
  styleUrl: 'x-spacer.css',
  shadow: false,
})
export class xSpacer {

  @Element() el: HTMLElement;

  @Prop() height: string;

  render() {

    this.el.style.setProperty('--spacer-height', this.height);

    return (
      <div></div>
    );
  }
}
