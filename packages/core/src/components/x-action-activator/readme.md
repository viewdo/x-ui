# X-ACTION-ACTIVATOR

This element defines how and when a group of Actions, defined with the [\<x-action\>](/components/x-action) element, are submitted through the [actions system](/actions).

## Usage

This element should only ever contain child [\<x-action\>](/components/x-action) tags. The attributes tells the parent The parent tag defines how and when the child actions are submitted through the [actions system](/actions).

```html
<x-action-activator
  activate='<activation-strategy>'
  ...
  supporting
  attributes
  ...
>
  <x-action ...></x-action>
  <x-action ...></x-action>
  <x-action ...></x-action>
</x-action-activator>
```

### Activation Strategies

The **activate** attribute define the strategy for activating all child actions, in the order they appear.

#### OnEnter

The **OnEnter** activation-strategy only works when this element is a child of [\<x-app-view-do\>](/components/x-app-view-do) . The child actions will fire when the parent route is activated and the contents are displayed.

```html
<x-app-view-do ...>
  <x-action-activator activate='OnEnter'>
    <x-action ...></x-action>
    <x-action ...></x-action>
    <x-action ...></x-action>
  </x-action-activator>
</x-app-view-do>
```

#### OnExit

The **OnEnter** activation-strategy only works when this element is a child of [\<x-app-view-do\>](/components/x-app-view-do). The child actions will fire when the parent route is de-activated and the next route is displayed.

```html
<x-app-view-do ...>
  <x-action-activator activate='OnExit'>
    <x-action ...></x-action>
    <x-action ...></x-action>
    <x-action ...></x-action>
  </x-action-activator>
</x-app-view-do>
```

#### AtTime

The **AtTime** activation-strategy only work when this element is a child of [\<x-app-view-do\>](/components/x-app-view-do) . The child actions will fire when the parent route has been activated for the given time within the **time** attribute.

```html
<x-app-view-do ...>
  <x-action-activator activate='AtTime' 
    time='3'>
    <x-action ...></x-action>
    <x-action ...></x-action>
    <x-action ...></x-action>
  </x-action-activator>
</x-app-view-do>
```

#### OnElementEvent

The **OnElementEvent** activation-strategy can be used anywhere within the **\<x-app\>** container. The child actions will fire when the target element raises the target event.

```html
<x-action-activator
  activate='OnElementEvent'
  target-element='#submit'
  target-event='click'
  multiple
>
  <x-action ...></x-action>
  <x-action ...></x-action>
  <x-action ...></x-action>
</x-action-activator>
<button id='submit'>Enter</button>
```

#### OnElementEvent: Default Element and Event

The default activation is OnElementEvent and the default event is click. Also, if no target-element is supplied, it looks for the first element that isn't an action or script and attaches to its event. If no target-event is defined, it assumes 'click'

```html
<x-action-activator>
  <x-action ...></x-action>
  <x-action ...></x-action>
  <x-action ...></x-action>
  <button>Click Me</button>
</x-action-activator>
```

> _PRO-TIP:_ This element appends any child input element's values to the actions it fires.

<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description                                                                                                                                                                                                       | Type                                                         | Default              |
| --------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------- |
| `activate`      | `activate`       | The activation strategy to use for the contained actions.                                                                                                                                                         | `"at-time" \| "on-element-event" \| "on-enter" \| "on-exit"` | `'on-element-event'` |
| `debug`         | `debug`          | Turn on debug statements for load, update and render events.                                                                                                                                                      | `boolean`                                                    | `false`              |
| `targetElement` | `target-element` | The element to watch for events when using the OnElementEvent activation strategy. This element uses the HTML Element querySelector function to find the element.  For use with activate="on-element-event" Only! | `string \| undefined`                                        | `undefined`          |
| `targetEvent`   | `target-event`   | This is the name of the event to listen to on the target element.                                                                                                                                                 | `string`                                                     | `'click'`            |
| `time`          | `time`           | The time, in seconds at which the contained actions should be submitted.  For use with activate="at-time" Only!                                                                                                   | `number \| undefined`                                        | `undefined`          |


## Methods

### `activateActions() => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

view.DO Experience Components
