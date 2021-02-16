# Audio Action Listener

The Audio Action Listener listens for action commands to control audio during presentations.

TOPIC: `audio`

```html
<x-action-activator activate="...">
  <x-action topic="audio" 
    command="<command>" 
    data-(key)="(value)"> 
  </x-action>
</x-action-activator>
```

## Commands

### `enable`

This command enables audio for all music, sound and video.

```html
<x-action-activator activate="...">
  <x-action topic="dxp" 
    command="enable"></x-action>
</x-action-activator>
```

### `disable`

This command disables audio for all music, sound and video.

```html
<x-action-activator activate="...">
  <x-action topic="dxp" 
    command="set-data" 
    data-(key)="(value)"> </x-action>
</x-action-activator>
```

---
Audio components have special action tags, to help shape the resulting action message.

---

### `load`

This command enables audio for all music, sound and video.

Arguments:

* **key** [required]\
  The input key to the experience input to update.

* **value** [required]\
  The value to set.

```html
<x-action-activator activate="...">
  <x-action topic="dxp" 
    command="set-data" 
    data-(key)="(value)"> </x-action>
</x-action-activator>
```
