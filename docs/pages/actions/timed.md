# Time Activation

Timed actions work using the **`<x-view-do/>`** time system. This system allows developers to fire off actions at a given time, in seconds from route entry.

> You should get an alert at 3 seconds! Also, this page will auto-redirect to the next page after 30 seconds.

```html
<x-view-do url="/timed" visit="optional" duration="30">
  <x-action-activator activate="AtTime" time="3">
    <x-action topic="interface" command="console" data-message="3-seconds has passed."></x-action>
  </x-action-activator>
  ... content ...
</x-view-do>
```
