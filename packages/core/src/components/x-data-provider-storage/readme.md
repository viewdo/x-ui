# X-DATA-PROVIDER-STORAGE

This component enables the **Storage Data Provider**.

## Cookie Data Provider

This store is short-lived within the browsing storage of an exact browser. This provider enables you to use storage data in your HTML.

Provider Key: '**storage**' (or custom)

`{{storage:(key)}`

<!-- Auto Generated Below -->


## Usage

### Actions

# Storage Action Listener

The Storage Action Listener can write or delete cookie data.

Topic: `storage`

```html
<x-action-activator activate="...">
  <x-action
    topic="storage"
    command="<command>"
    data-(key)="(value)"
  ></x-action>
</x-action-activator>
```

## Commands

### `set-data`

This command sets the data in storage.

Arguments:

- **(key:value)[]**\
  All other key-values pairs will be passed to the data provider.

```html
<x-action-activator activate="...">
  <x-action
    topic="storage"
    command="set-data"
    data-(key)="(value)"
  ></x-action>
</x-action-activator>
```

### `remove-data`

This command sets the data in storage.

Arguments:

- **(key:value)[]**\
  All other key-values pairs will be passed to the data provider.

```html
<x-action-activator activate="...">
  <x-action
    topic="storage"
    command="remove-data"
    data-(key)="(value)"
  ></x-action>
</x-action-activator>
```


### Provider

# Storage Data Providers

> Data Providers a read-only data-store to resolve using expressions.

This provider uses the built-in key-value store in the browser to persist data across browsing sessions within the same browser.

Browser Storage: **storage**

## Installation

The storage provider is registered using a component **[\<x-data-provider-storage\>](/components/x-data-provider-storage)**.

```html
<x-data-provider-storage prefix="x" name="storage">
</x-data-provider-storage>
```

## Local Storage

This store is long-lived from the same browser. and used to track 'session visits' and other temporary values.

Provider Key: '**storage**'

`{<name>:(<key>}`



## Properties

| Property    | Attribute    | Description                               | Type                  | Default     |
| ----------- | ------------ | ----------------------------------------- | --------------------- | ----------- |
| `keyPrefix` | `key-prefix` | The key prefix to use in storage          | `string \| undefined` | `undefined` |
| `name`      | `name`       | Provider name to use in x-ui expressions. | `string`              | `'storage'` |


----------------------------------------------

view.DO Experience Components
