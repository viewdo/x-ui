import * as internal from '@stencil/core/internal'
import { IEventEmitter } from '../../common/interfaces'
import { requireValue } from '../../common/values'

/**
 * Call this function when the configured event from the event-bus
 * is received.
 *
 * @example
```
@OnEvent('event-name')
myFunction(event: string, args: any[]) {

}
```
 */
export function OnEvent(
  eventBus: IEventEmitter,
  name: string,
  when?: (instance: any, args: any[]) => boolean,
) {
  requireValue(name, 'name', 'OnEvent(decorator)')

  return (
    instance: internal.ComponentInterface,
    methodName: string,
  ) => {
    let dispose!: () => void

    const { componentWillLoad, disconnectedCallback } = instance

    // register the handler to run on load
    instance.componentWillLoad = () => {
      const method: (
        instance: any,
        args?: any[],
      ) => void | Promise<void> = instance[methodName]
      dispose = eventBus.on(name, async (...args: any[]) => {
        if (when && !when(instance, args)) return
        await method?.call(instance, instance, args)
      })

      return componentWillLoad && componentWillLoad.call(instance)
    }
    // register our subscription disposer
    instance.disconnectedCallback = () => {
      dispose?.call(instance)
      return (
        disconnectedCallback && disconnectedCallback.call(instance)
      )
    }
  }
}
