import * as internal from '@stencil/core/internal'
import { forceUpdate } from '@stencil/core/internal'
import { IEventEmitter } from '../../common/interfaces'
import { requireValue } from '../../common/values'
/**
 * ForceUpdate this component when the eventBus receives an event
 * as defined in the options parameter.
 *
 * Add this decorator to your componentWillLoad Method.
 *
 * @example
```
@UpdateOnEvent({
  name: 'data-changed'
})
async componentWillLoad() {

}
```
 */
export function UpdateOnEvent(
  eventBus: IEventEmitter,
  name: string,
  when?: (instance: any, args: any[]) => boolean,
) {
  requireValue(name, 'name', 'UpdateOnEvent(decorator)')

  return (instance: internal.ComponentInterface, method: string) => {
    if (method != 'componentWillLoad')
      throw Error(
        'UpdateOnEvent(decorator): this decorator should be placed on the componentWillLoad method ',
      )

    let dispose: () => void
    const { componentWillLoad, disconnectedCallback } = instance

    // register the handler to run on load
    instance.componentWillLoad = () => {
      dispose = eventBus.on(name, (...args: any[]) => {
        if (when && !when!(instance, args)) return
        forceUpdate(instance)
      })

      return componentWillLoad && componentWillLoad.call(instance)
    }
    // register our subscription dispose on disconnect
    instance.disconnectedCallback = () => {
      dispose?.call(instance)
      return (
        disconnectedCallback && disconnectedCallback.call(instance)
      )
    }
  }
}
