# X-APP-LINK

The element should be used in-place of an `a` tag to navigate without refreshing the page. This element supports an active-class that will be applied when the route in **href** matches the route of the app. This is helpful for menus, bread-crumbs and tabs.

## Usage

```html
<x-app-link href="/route"> ... </x-app-link>
```

```html
<x-app-link href="/route" custom="div"> ... </x-app-link>
```

<!-- Auto Generated Below -->


## Properties

| Property            | Attribute      | Description                                                        | Type      | Default         |
| ------------------- | -------------- | ------------------------------------------------------------------ | --------- | --------------- |
| `activeClass`       | `active-class` | The class to add when this HREF is active in the browser           | `string`  | `'link-active'` |
| `debug`             | `debug`        |                                                                    | `boolean` | `false`         |
| `exact`             | `exact`        | Only active on the exact href match no not on child routes         | `boolean` | `false`         |
| `href` _(required)_ | `href`         | The destination route for this link                                | `string`  | `undefined`     |
| `strict`            | `strict`       | Only active on the exact href match using every aspect of the URL. | `boolean` | `true`          |


----------------------------------------------

view.DO : Experience Platform
