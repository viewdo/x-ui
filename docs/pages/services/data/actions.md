# Data Action Listener

The Data Action Listener listens for action commands to request updates from the
given data-providers.

Topic: `data`

```html
<x-action-activator activate="...">
  <x-action topic="data" 
    command="<command>" 
    data-(key)="(value)"></x-action>
</x-action-activator>
```

## Commands

### `set-data`

This command sets the experience data

Arguments:

* **provider** (required)\
  The input key to the experience input to update.

* **(key:value)[]**\
  All other key-values pairs will be passed to the data provider.

```html
<x-action-activator activate="...">
  <x-action topic="data" 
    command="set-data" 
    data-provider="<provider>" 
    data-(key)="(value)"></x-action>
</x-action-activator>
```

### `register-provider`

Register a new data-provider. See [Data Providers](/content/data/providers) for more information.
