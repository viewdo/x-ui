# X-CONTENT-INCLUDE

This component fetches remote HTML and renders it safely and directly into the page when when and where you tell it too, as soon as it renders.

## Usage

```html
<x-content-include src="<url-to-html>"> </x-content-include>
```

### Delayed Rendering

When using this component, you may want to delay the fetch until the content is needed. The **no-render** attribute will prevent the HTML from being fetched until that attribute is removed.

```html
<x-content-include id="include" src="<url-to-html>" no-render> </x-content-include>
```

You can remove the attribute programmatically to force the fetch:

```javascript
const include = document.querySelector("#include);
include.removeAttribute('no-render');
```

Or, just include it in one of the components [\<x-app-view\>](/components/x-app-view) or [\<x-app-view-do\>](/components/x-app-view-do). These components remove any **no-render** attributes on child elements once their route is activated, giving us lazy-loaded routes with this component.

<!-- Auto Generated Below -->


## Properties

| Property           | Attribute   | Description                                                                                                  | Type      | Default     |
| ------------------ | ----------- | ------------------------------------------------------------------------------------------------------------ | --------- | ----------- |
| `noRender`         | `no-render` | If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute. | `boolean` | `false`     |
| `src` _(required)_ | `src`       | Remote Template URL                                                                                          | `string`  | `undefined` |


----------------------------------------------

view.DO : Experience Platform
