# Data Action Listener

The Data Action Listener listens for action commands to request updates from the
given data-providers.

Topic: `data`

```html
<x-action-activator activate="...">
  <x-action topic="data" command="<command>"></x-action>
</x-action-activator>
```

## Commands

### `register-provider`

This action registers a custom data-provider.
