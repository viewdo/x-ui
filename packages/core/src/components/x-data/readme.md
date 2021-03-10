# x-data

<!-- Auto Generated Below -->


## Usage

### Actions

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

Register a new data-provider. See [Data Providers](/data/providers) for more information.



## Properties

| Property          | Attribute          | Description                                                                                                                                                                                                                     | Type     | Default |
| ----------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| `providerTimeout` | `provider-timeout` | The wait-time, in milliseconds to wait for un-registered data providers found in an expression. This is to accommodate a possible lag between evaluation before the first view-do 'when' predicate an the registration process. | `number` | `500`   |


----------------------------------------------

view.DO Experience Components
