import { Component, h, Host } from '@stencil/core'
import { debugIf } from '../../services/common/logging'
import { commonState } from '../../services/common/state'
import { ElementsActionListener } from './elements/actions'

@Component({
  tag: 'x-elements',
  shadow: true,
})
export class XElements {
  private listener!: ElementsActionListener

  componentWillLoad() {
    debugIf(
      commonState.debug,
      `x-data: Elements services enabled. Element ACtions Listener registered`,
    )

    this.listener = new ElementsActionListener()
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    )
  }

  disconnectedCallback() {
    this.listener.destroy()
  }
}
