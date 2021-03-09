# X-DATA-PROVIDER-COOKIE

This component enables the **Cookie Data Provider**, after requesting consent from the user. The consent message and the accept/reject button are customizable.

## Cookie Data Provider

This store is long-lived from the same browser, but for very small data items. This provider enables you to use cookie data in your HTML.

Provider Key: '**cookie**'

`{{cookie:(key)}`

When included on the page, this component automatically shows a banner to collect consent from the user. You MUST supply clickable elements and decorate them with **x-accept** and **x-reject** attributes, respecting the user's decision.

The component listens for their click events and acts accordingly.

```html
<x-data-provider-cookie>
  <p>Cookies help us track your every move.</p>
  <button x-accept>Accept</button>
  <button x-reject>Decline</button>
</x-data-provider-cookie>
```

> The HTML inside the element is shown directly on the banner. Use it to display your terms, privacy policy and explanation for using the cookie.

Alternatively, you can skip this by including the 'skip-consent' attribute.

```html
<x-data-provider--cookie skip-consent></x-data-provider--cookie>
```

<!-- Auto Generated Below -->


## Usage

### Actions

# Cookie Action Listener

The Cookie Action Listener can write or delete cookie data.

Topic: `cookie`

```html
<x-action-activator activate="...">
  <x-action
    topic="cookie"
    command="<command>"
    data-(key)="(value)"
  ></x-action>
</x-action-activator>
```

## Commands

### `set-data`

This command encodes and sets data into the browser cookie for this user/browser combination.

Arguments:

- **(key:value)[]**\
  All other key-values pairs will be passed to the data provider.

```html
<x-action-activator activate="...">
  <x-action
    topic="cookie"
    command="set-data"
    data-(key)="(value)"
  ></x-action>
</x-action-activator>
```

### `remove-data`

This command removes data from the cookie
Arguments:

- **(key:value)[]**\
  All other key-values pairs will be passed to the data provider.

```html
<x-action-activator activate="...">
  <x-action
    topic="cookie"
    command="remove-data"
    data-(key)="(value)"
  ></x-action>
</x-action-activator>
```


### Provider

# Session Data Providers

> Data Providers a read-only data-store to resolve using expressions.

This provider uses the built-in key-value store in the browser to persist data across page-refreshes during a single browsing sessions.

Cookies: **cookie** `<x-data-provider-cookie>`

## Installation

The cookie provider is registered using a component **[\<x-data-provider-cookie\>](/components/x-data-provider-cookie)**.

```html
<x-data-provider-cookie name="cookie"> </x-data-provider-cookie>
```

### Cookie Storage

This store is long-lived from the same browser, but for very small data items.

Provider Key: '**cookie**'

`{cookie:(key)}`



## Properties

| Property      | Attribute      | Description                                                                                             | Type      | Default    |
| ------------- | -------------- | ------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| `name`        | `name`         | Provider name to use in x-ui expressions.                                                               | `string`  | `'cookie'` |
| `skipConsent` | `skip-consent` | When skipConsent is true, the accept-cookies banner will not be displayed before accessing cookie-data. | `boolean` | `false`    |


## Events

| Event        | Description                                        | Type                                   |
| ------------ | -------------------------------------------------- | -------------------------------------- |
| `didConsent` | This event is raised when the consents to cookies. | `CustomEvent<{ consented: boolean; }>` |


## Methods

### `registerProvider() => Promise<void>`

Immediately register the provider.

#### Returns

Type: `Promise<void>`




----------------------------------------------

view.DO Experience Components
