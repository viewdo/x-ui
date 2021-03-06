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
