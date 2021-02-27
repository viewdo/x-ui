# Interface Actions

The default Interface Action Listener is configured to handle commands meant to alter HTML elements
raised through the [Actions](/actions).

Topic: `interface`

```html
<x-action-activator activate="...">
  <x-action topic="interface" 
    command="<command>" 
    data-(key)="(value)"> </x-action>
</x-action-activator>
```

## Commands

### `set-theme`

Sets the main page theme to dark or light.

Arguments:

*{{:required}} **theme** (required)\
  Set's the theme to 'dark' or 'light'.

```html
<x-action-activator activate="...">
  <x-action topic="interface" 
    command="set-theme" 
    data-theme="dark"> </x-action>
</x-action-activator>
```

### `console`

Writes data to the console using console.log()

> Same as `console.log()` in JavaScript

Arguments:

*{{:required}} **data** (required)\
  Any data that is sent to console.log

```html
<x-action-activator activate="...">
  <x-action topic="interface" 
    command="set-theme" 
    data-theme="dark"> </x-action>
</x-action-activator>
```
