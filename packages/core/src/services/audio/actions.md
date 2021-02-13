# Audio Action Listener

The Audio Action Listener listens for action commands to control audio during presentations.

TOPIC: `audio`

```html
<x-action-activator activate="...">
  <x-action topic="audio" 
    command="<command>" ...> 
  </x-action>
</x-action-activator>
```

## Commands

### `set-data`

This command sets the experience data

Arguments:

- **key** [required]\
  The input key to the experience input to update.

- **value** [required]\
  The value to set.

```html
<x-action-activator activate="...">
  <x-action topic="dxp" command="set-data" data-(key)="(value)"> </x-action>
</x-action-activator>
```
