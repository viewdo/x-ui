import { Component, Host, Prop, Listen, Element, State, h } from '@stencil/core';

@Component({
  tag: 'x-logo',
  styleUrl: 'x-logo.scss',
  shadow: true
})

export class DynamicLogo {

  @Element() el: HTMLElement;
  @State() logoSrc: string;

  @Prop() href: string;
  @Prop() src!: string;
  @Prop() srcSmall: string;
  @Prop() srcBreakpoint: number = 225;
  @Prop() maxWidth = "10rem";
  @Prop() backgroundColor = "#3880ff";
  @Prop() border = "4px solid #2d61bd";

  @Listen('resize', { target: 'window', capture: false, passive: true })


  handleWindowResize() {
    this.setLogoSize();
  }

  setLogoSize() {
    let componentWidth = Number(this.el.getBoundingClientRect().width.toFixed(0));

    if (componentWidth < this.srcBreakpoint) {
      this.logoSrc = this.srcSmall
    } else {
      this.logoSrc = this.src
    }
  }

  componentWillLoad() {
    this.logoSrc = this.src
  }

  componentDidRender() {
    this.setLogoSize();
  }

  render() {

    this.el.style.setProperty('--max-component-width', this.maxWidth);
    this.el.style.setProperty('--background-color', this.backgroundColor);
    this.el.style.setProperty('--border', this.border);

    return (
      <Host>
        <div>
          <a href={this.href} target="_blank" title="view.DO">
            <img id="logo" src={this.logoSrc} alt="view.DO Logo" />
          </a>
        </div>
      </Host>
    )
  }
}
