# X-CONTENT

This component fetches remote HTML and renders it safely and directly into the page when when and where you tell it too, as soon as it renders.

## Usage

```html
<x-content src="<url-to-html>"> </x-content>
```

### Delayed Rendering

When using this component, you may want to delay the fetch until the content is needed. The **defer-load** attribute will prevent the HTML from being fetched until that attribute is removed.

```html
<x-content id="include" src="<url-to-html>" defer-load> </x-content>
```

You can remove the attribute programmatically to force the fetch:

```javascript
const include = document.querySelector("#include);
include.removeAttribute('defer-load');
```

Or, just include it in one of the components [\<x-app-view\>](/components/x-app-view) or [\<x-app-view-do\>](/components/x-app-view-do). These components remove any **defer-load** attributes on child elements once their route is activated, giving us lazy-loaded routes with this component.

<!-- Auto Generated Below -->


## Properties

| Property           | Attribute        | Description                                                                                                                                                                        | Type                                                 | Default     |
| ------------------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------- |
| `deferLoad`        | `defer-load`     | If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute.                                                                       | `boolean`                                            | `false`     |
| `mode`             | `mode`           | Cross Origin Mode                                                                                                                                                                  | `"cors" \| "navigate" \| "no-cors" \| "same-origin"` | `'cors'`    |
| `resolveTokens`    | `resolve-tokens` | Before rendering HTML, replace any data-tokens with their resolved values. This also commands this component to re-render it's HTML for data-changes. This can affect performance. | `boolean`                                            | `true`      |
| `src` _(required)_ | `src`            | Remote Template URL                                                                                                                                                                | `string`                                             | `undefined` |
| `when`             | `when`           | A data-token predicate to advise this component when to render (useful if used in a dynamic route or if tokens are used in the 'src' attribute)                                    | `string \| undefined`                                | `undefined` |


----------------------------------------------

view.DO Experience Components
