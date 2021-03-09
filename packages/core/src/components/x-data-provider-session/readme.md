# X-DATA-PROVIDER-SESSION

This component enables the **Session Data Provider**.

## Cookie Data Provider

This store is short-lived within the browsing session of an exact browser. This provider enables you to use session data in your HTML.

Provider Key: '**session**'

`{{session:(key)}`

<!-- Auto Generated Below -->


## Usage

### Actions

# Session Action Listener

The Session Action Listener can write or delete cookie data.

Topic: `session`

```html
<x-action-activator activate="...">
  <x-action
    topic="session"
    command="<command>"
    data-(key)="(value)"
  ></x-action>
</x-action-activator>
```

## Commands

### `set-data`

This command sets the experience data

Arguments:

- **(key:value)[]**\
  All other key-values pairs will be passed to the data provider.

```html
<x-action-activator activate="...">
  <x-action
    topic="session"
    command="set-data"
    data-(key)="(value)"
  ></x-action>
</x-action-activator>
```

### `remove-data`

This command sets the data in session.

Arguments:

- **(key:value)[]**\
  All other key-values pairs will be passed to the data provider.

```html
<x-action-activator activate="...">
  <x-action
    topic="session"
    command="remove-data"
    data-(key)="(value)"
  ></x-action>
</x-action-activator>
```


### Provider

# Session Data Providers

> Data Providers a read-only data-store to resolve using expressions.

This provider uses the built-in key-value store in the browser to persist data across page-refreshes during a single browsing sessions.

Browser Session: **session**

## Installation

The session provider is registered using a component **[\<x-data-provider-session\>](/components/x-data-provider-session)**.

```html
<x-data-provider-session prefix="x" name="session">
</x-data-provider-session>
```

### Session Storage

This store is short-lived and used to track 'session visits' and other temporary values.

Provider Key: '**session**'

`{<name>:(<key>}`



## Properties

| Property    | Attribute    | Description                               | Type                  | Default     |
| ----------- | ------------ | ----------------------------------------- | --------------------- | ----------- |
| `keyPrefix` | `key-prefix` | The key prefix to use in storage          | `string \| undefined` | `undefined` |
| `name`      | `name`       | Provider name to use in x-ui expressions. | `string`              | `'session'` |


----------------------------------------------

view.DO Experience Components
