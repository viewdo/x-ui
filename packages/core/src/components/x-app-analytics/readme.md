# X-APP-ANALYTICS

The [\<x-app-analytics\>](/components/x-app-analytics) component delegates internal analytics commands to DOM events
allowing developers to connect events to any analytics provider.

## Usage

Using the [\<x-app-analytics\>](/components/x-app-analytics) is simple, but does require some scripting.

### GTM Example

```html
<head>
  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script
    async
    src='https://www.googletagmanager.com/gtag/js?id=G-ZZZ'
  ></script>
  <script>
    window.dataLayer = window.dataLayer || []
    function gtag() {
      dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', 'G-ZZZZ')
  </script>
</head>
<body>
  ...
  <x-app-analytics id='analytics'>
    <script>
      analytics.addEventListener('events', e => {
        console.log(`event: ${JSON.stringify(e.detail)}`)
        gtag(e.detail.key, e.detail.value)
      })
      analytics.addEventListener('page-view', e => {
        console.log(`event: ${JSON.stringify(e.detail)}`)
        gtag('page_view', e.detail.pathname)
      })
      analytics.addEventListener('x:analytics:view-time', e => {
        console.log(`event: ${JSON.stringify(e.detail)}`)
        gtag(e.detail.key, e.detail.value)
      })
    </script>
  </x-app-analytics>
</body>
```

<!-- Auto Generated Below -->


## Usage

### Actions

# Analytics Actions

The Analytics Action Listener is configured to handle commands raised through the [actions system](/actions)
to send to all analytics components which can execute functions for any analytics system configured.

Topic: `analytics`

```html
<x-action-activator activate="...">
  <x-action topic="analytics" command="<command>" ...> </x-action>
</x-action-activator>
```

## Commands

### `send-event`

Sends the payload to the onEvent handler in x-analytics component.

- **(key:value)[]**\
  All key-values pairs are sent to the handler.

```html
<x-action-activator activate="...">
  <x-action
    topic="analytics"
    command="send-event"
    data-(key)="(value)"
  >
  </x-action>
</x-action-activator>
```

### `send-view-time`

Sends the payload to the onEvent handler in x-analytics component.

- **(key-values)[]**\
  All key-values pairs are sent to the handler.

```html
<x-action-activator activate="...">
  <x-action
    topic="analytics"
    command="send-view-time"
    data-value="(value)"
  >
  </x-action>
</x-action-activator>
```

### `send-page-view`

Sends the payload to the onEvent handler in x-analytics component.

- **(key:value)[]**\
  All key-values pairs are sent to the handler.

```html
<x-action-activator activate="...">
  <x-action
    topic="analytics"
    command="send-page-view"
    data-value="(page)"
  >
  </x-action>
</x-action-activator>
```



## Events

| Event       | Description              | Type               |
| ----------- | ------------------------ | ------------------ |
| `event`     | Raised analytics events. | `CustomEvent<any>` |
| `page-view` | Page views.              | `CustomEvent<any>` |
| `view-time` | View percentage views.   | `CustomEvent<any>` |


----------------------------------------------

view.DO Experience Components
