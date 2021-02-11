# X-UI-ANALYTICS

The `<x-ui-analytics>` component delegates internal analytics commands to DOM events
allowing developers to connect events to any analytics provider.

## Usage

Using the `<x-ui-analytics>` is simple, but does require some scripting.

### GTM Example

```html
<head>
  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZZZ"></script>
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
  <x-ui-analytics id="analytics">
    <script>
      analytics.addEventListener('x:analytics:event', (e) => {
        console.log(`event: ${JSON.stringify(e.detail)}`)
        gtag(e.detail.key, e.detail.value)
      })
      analytics.addEventListener('x:analytics:page-view', (e) => {
        console.log(`event: ${JSON.stringify(e.detail)}`)
        gtag('page_view', e.detail.pathname)
      })
      analytics.addEventListener('x:analytics:view-percentage', (e) => {
        console.log(`event: ${JSON.stringify(e.detail)}`)
        gtag(e.detail.key, e.detail.value)
      })
    </script>
  </x-ui-analytics>
</body>

## Event Detail
```

<!-- Auto Generated Below -->


## Events

| Event                         | Description              | Type               |
| ----------------------------- | ------------------------ | ------------------ |
| `x:analytics:event`           | Raised analytics events. | `CustomEvent<any>` |
| `x:analytics:page-view`       | Page views.              | `CustomEvent<any>` |
| `x:analytics:view-percentage` | View percentage views.   | `CustomEvent<any>` |


----------------------------------------------

view.DO : Experience Platform
