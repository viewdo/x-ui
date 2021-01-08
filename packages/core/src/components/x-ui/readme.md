# X-UI

The root component is the base container for the view-engine and its child components. This element should contain root-level HTML that is global to every view along with x-view components placed within any global-html.

## Usage

```html
<x-ui app-title="view.DO Web Components" history-type="browser|hash" scroll-top-offset="0" transition="fade-in" full-page="false" start-url="/" root="" debug>
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

<!-- Auto Generated Below -->


## Properties

| Property              | Attribute           | Description                                                                                                                  | Type                  | Default     |
| --------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `appTitle`            | `app-title`         | This is the application / site title. If the views or dos have titles, this is added as a suffix.                            | `string \| undefined` | `undefined` |
| `debug`               | `debug`             | Turn on debugging to get helpful messages from the routing, data and action systems.                                         | `boolean`             | `false`     |
| `mode`                | `mode`              | Browser (paths) or Hash (#) routing. To support browser history, the HTTP server must be setup for a PWA                     | `"browser" \| "hash"` | `'browser'` |
| `root`                | `root`              | This is the root path that the actual page is, if it isn't '/', then the router needs to know where to begin creating paths. | `string`              | `'/'`       |
| `router` _(required)_ | --                  | This is the router service instantiated with this component.                                                                 | `RouterService`       | `undefined` |
| `scrollTopOffset`     | `scroll-top-offset` | Header height or offset for scroll-top on this and all views.                                                                | `number \| undefined` | `undefined` |
| `startUrl`            | `start-url`         | This is the start path a user should land on when they first land on this app.                                               | `string`              | `'/'`       |
| `transition`          | `transition`        | Navigation transition between routes. This is a CSS animation class.                                                         | `string \| undefined` | `undefined` |


## Events

| Event       | Description                                                                                                                | Type               |
| ----------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `x:actions` | These events are **`<x-ui/>`** command-requests for action handlers to perform tasks. Any handles should cancel the event. | `CustomEvent<any>` |
| `x:events`  | Listen for events that occurred within the **`<x-ui/>`** system.                                                           | `CustomEvent<any>` |


----------------------------------------------

view.DO : Experience Platform
