# X-UI

The root component is the base container for the view-engine and its child components. This element should contain root-level HTML that is global to every view along with x-view components placed within any global-html.

## Usage

```html
<x-ui
  app-title="view.DO Web Components"
  history-type="browser|hash"
  scroll-top-offset="0"
  transition="fade-in"
  full-page="false"
  start-url="/"
  root=""
  debug
>
  ...
  <x-view ...></x-view>
  <x-view ...></x-view>
  ...
</x-ui>
```

## Routing

This component is the root container for all routing. It provides an entry-point for the content-routing.

**Responsibilities:**

- Content navigation settings
- Event Action Listener Registrations
- Event Action event delegation to and from the bus
- Page title

For more information on routing, check out the [routing](/routing) documentation. Also, check out the [**`<x-view>`**](/components/x-view) and [**`<x-view-do>`**](/components/x-view-do) components.

### Child Attribute Detection & Resolution

The following attributes are queried to resolve certain data-values or show/hide conditions for all child elements.

#### Cloak: [x-cloak]

For each child element with this attribute, the value of the attribute is removed when the XUI component is fully loaded. This
attribute is target in css for `display:none`.

```html
<any x-hide-when="predicate" />
```

#### Hide: [x-hide]

For each child element with this attribute, the value of the attribute is removed when the XUI component is fully loaded
and replaced with `hidden`. The hidden
attribute is also a target in css for `display:none`. This
is used to hide content once the components have loaded.

```html
<any x-hide-when="predicate" />
```

#### Hide When: [x-hide-when]

For each child element with this attribute, the value of the attribute is evaluated for a predicate – and if TRUE, the element is hidden. This evaluation occurs whenever data-changes.

```html
<any x-hide-when="predicate" />
```

#### Show When: [x-show-when]

For each child element with this attribute, the value of the attribute is evaluated for a predicate – and if FALSE, the element is shown. This evaluation occurs whenever data-changes.

```html
<any x-show-when="predicate" hidden />
```

> To initially hide the element, be sure to include the ‘hidden’ attribute.

#### Conditioned Classes: [x-class-when] && [x-class]

This pair of attributes conditionally toggle the class specified in the `x-class` attribute using the `x-class-where` expression.

```html
<any x-class="class" x-class-when="predicate"></any>
```

#### Value From: [x-value-from]

Input-type elements (input, textarea and select) can specify a data expression for its value. This informs the route container to update this value when it changes.

```html
<any x-class="class" x-class-when="predicate"></any>
```

<!-- Auto Generated Below -->


## Properties

| Property              | Attribute            | Description                                                                                                                                                                                                                     | Type                  | Default     |
| --------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `animationInterval`   | `animation-interval` | The interval, in milliseconds to use with the element-timer (used in place for a video) when timing animations in  x-view-do elements.                                                                                          | `number`              | `500`       |
| `appTitle`            | `app-title`          | This is the application / site title. If the views or dos have titles, this is added as a suffix.                                                                                                                               | `string \| undefined` | `undefined` |
| `debug`               | `debug`              | Turn on debugging to get helpful messages from the routing, data and action systems.                                                                                                                                            | `boolean`             | `false`     |
| `providerTimeout`     | `provider-timeout`   | The wait-time, in milliseconds to wait for un-registered data providers found in an expression. This is to accommodate a possible lag between evaluation before the first view-do 'when' predicate an the registration process. | `number`              | `500`       |
| `root`                | `root`               | This is the root path that the actual page is, if it isn't '/', then the router needs to know where to begin creating paths.                                                                                                    | `string`              | `''`        |
| `router` _(required)_ | --                   | This is the router service instantiated with this component.                                                                                                                                                                    | `RouterService`       | `undefined` |
| `scrollTopOffset`     | `scroll-top-offset`  | Header height or offset for scroll-top on this and all views.                                                                                                                                                                   | `number \| undefined` | `undefined` |
| `startUrl`            | `start-url`          | This is the start path a user should land on when they first land on this app.                                                                                                                                                  | `string \| undefined` | `undefined` |
| `transition`          | `transition`         | Navigation transition between routes. This is a CSS animation class.                                                                                                                                                            | `string \| undefined` | `undefined` |


## Events

| Event       | Description                                                                                                                | Type               |
| ----------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `x:actions` | These events are **`<x-ui/>`** command-requests for action handlers to perform tasks. Any handles should cancel the event. | `CustomEvent<any>` |
| `x:events`  | Listen for events that occurred within the **`<x-ui/>`** system.                                                           | `CustomEvent<any>` |


----------------------------------------------

view.DO : Experience Platform
