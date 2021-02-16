# Enter & Exit Actions

[Event actions](/actions) work using by attaching to the parent `x-view-do` element. The enter and exit only apply when the route is matched exactly.

> You should get two alerts. One on entry and one when you exit.

```html
<x-view-do url="/events" visit="optional">
  <x-action-activator activate="OnEnter">
    <x-action topic="document" command="alert" data='{"message": "Testing on-enter action"}'></x-action>
  </x-action-activator>
  <x-action-activator activate="OnExit">
    <x-action topic="document" command="alert" data='{"message": "Testing on-exit action"}'></x-action>
  </x-action-activator>
  ... content ...
</x-view-do>
```
