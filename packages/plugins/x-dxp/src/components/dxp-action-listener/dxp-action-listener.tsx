import { Component, Element, h, Prop } from '@stencil/core'
import { EventEmitter as Emitter, Experience, onChange, state } from '../..'

@Component({
  tag: 'dxp-action-listener',
  shadow: true,
})
export class DxpActionListener {
  changed!: Emitter
  @Element() el!: HTMLDxpActionListenerElement
  private experience?: Experience

  /**
   * When debug is true, a reactive table of values is displayed.
   */
  @Prop() debug = false

  /**
   *Customize the name used for this sample data provider.
   */
  @Prop() name = 'dxp'

  async componentWillLoad() {
    this.changed = new Emitter()
    if (state.experience) {
      this.experience = state.experience
    }

    onChange('experience', (e) => {
      this.experience = e
      this.changed.emit('data-changed')
    })
  }

  componentDidLoad() {
    const registerAction = new CustomEvent('actionEvent', {
      detail: {
        topic: 'data',
        command: 'register-provider',
        data: {
          name: this.name,
          provider: this,
        },
      },
    })
    this.el.parentElement?.closest('x-ui')?.dispatchEvent(registerAction)
  }

  async get(key: string): Promise<string> {
    return this.experience?.data[key] as string
  }

  async set(key: string, value: any) {
    await this.experience?.setData(key, value)
  }

  render() {
    return <slot></slot>
  }
}
