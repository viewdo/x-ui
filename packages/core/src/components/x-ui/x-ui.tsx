import { Component } from '@stencil/core'
import { debugIf } from '../../services/common/logging'
import { commonState } from '../../services/common/state'
import { actionBus, eventBus } from '../../services/events'
import { UIActionListener } from './ui/actions'

@Component({
  tag: 'x-ui',
  shadow: true,
})
export class XUI {
  private listener: UIActionListener
  async componentWillLoad() {
    debugIf(
      commonState.debug,
      `x-ui: services enabled. UI listener registered`,
    )
    this.listener = new UIActionListener()
    this.listener.initialize(window, actionBus, eventBus)
  }

  render() {
    return null
  }
}
