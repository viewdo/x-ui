import { Component, h, Host, Prop, State } from '@stencil/core'
import { onVideoChange, videoState } from '../../services/video'

/**
 * @system video
 */
@Component({
  tag: 'x-app-autoplay',
  shadow: false,
})
export class XAppAutoplay {
  private checkbox?: HTMLInputElement
  private videoSubscription!: () => void
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
    this.autoPlay = videoState.autoplay

    this.videoSubscription = onVideoChange('autoplay', (a) => {
      this.autoPlay = a
    })
  }

  private toggleAutoPlay() {
    videoState.autoplay = this.checkbox?.checked || false
  }

  disconnectedCallback() {
    this.videoSubscription?.call(this)
  }

  render() {
    return (
      <Host>
        <input
          type="checkbox"
          class={this.classes}
          id={this.inputId}
          ref={(e) => {
            this.checkbox = e
          }}
          onChange={() => this.toggleAutoPlay()}
          checked={this.autoPlay}
        ></input>
      </Host>
    )
  }
}
