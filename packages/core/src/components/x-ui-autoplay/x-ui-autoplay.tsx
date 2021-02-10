import { Component, h, Host, Prop, State } from '@stencil/core';
import { interfaceState } from '../..';
import { onInterfaceChange } from '../../services';

/**
 * @system presentation
 */
@Component({
  tag: 'x-ui-autoplay',
  shadow: false,
})
export class XUiAutoplay {
  private slider?: HTMLInputElement
  private subscriptionDispose!: () => void
  @State() autoPlay = true

  /**
   *
   */
  @Prop() classes?: string

  /**
   *
   */
  @Prop() inputId?: string

  componentWillLoad() {
    this.autoPlay = interfaceState.autoplay

    this.subscriptionDispose = onInterfaceChange('autoplay', (a) => {
      this.autoPlay = a
    })
  }

  private toggleAutoPlay() {
    interfaceState.autoplay = this.slider?.checked || false
  }

  disconnectedCallback() {
    this.subscriptionDispose()
  }

  render() {
    return (
      <Host>
        <input
          type="checkbox"
          class={this.classes}
          id={this.inputId}
          ref={(e) => {
            this.slider = e
          }}
          onChange={() => this.toggleAutoPlay()}
          checked={this.autoPlay}
        ></input>
      </Host>
    )
  }
}
