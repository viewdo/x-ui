# X-CONTENT-MARKDOWN

## Usage

```html
<!-- Simply set the `src` attribute and win -->
<x-content-markdown src="https://example.com/markdown.md"></x-content-markdown>
```

### Inline Markdown

You also use markdown inline.

```html
<!-- Do not set the `src` attribute -->
<x-content-markdown>
  <!-- Write your markdown inside a `<script type="text/markdown">` tag -->
  <script type="text/markdown">
    # **This** is my [markdown](https://example.com)
  </script>
</x-content-markdown>
```

### Delayed Rendering

When using this component, you may want to delay the fetch until the content is needed. The **defer-load** attribute will prevent the HTML from being fetched until that attribute is removed.

```html
<x-content-markdown id="markdown" src="<url-to-html>" defer-load> </x-content-markdown>
```

You can remove the attribute programmatically to force the fetch:

```javascript
const include = document.querySelector("#markdown);
include.removeAttribute('defer-load');
```

Or, just include it in one of the components [\<x-app-view\>](/components/x-app-view) or [\<x-app-view-do\>](/components/x-app-view-do). These components remove any **defer-load** attributes on child elements once their route is activated, giving us lazy-loaded routes with this component.

## Styling

By default, there is no styling. The HTML is rendered to the page without styles. For basic styles, you can include the Marked.js css file in the head:

```html
<head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/gh/sindresorhus/github-markdown-css@4/github-markdown.min.css"
  />
</head>
```

### Code Styling

```html
<head>
  <script src="https://cdn.jsdelivr.net/gh/PrismJS/prism@1/prism.min.js" data-manual=""></script>
  <script src="https://cdn.jsdelivr.net/gh/PrismJS/prism@1/plugins/autoloader/prism-autoloader.min.js"></script>

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/PrismJS/prism@1/themes/prism.min.css" />
</head>
```

<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                                                                                                  | Type                  | Default     |
| ----------- | ------------ | ------------------------------------------------------------------------------------------------------------ | --------------------- | ----------- |
| `baseUrl`   | `base-url`   | Base Url for embedded links                                                                                  | `string \| undefined` | `undefined` |
| `deferLoad` | `defer-load` | If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute. | `boolean`             | `false`     |
| `renderIf`  | `render-if`  | If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute. | `string \| undefined` | `undefined` |
| `src`       | `src`        | Remote Template URL                                                                                          | `string \| undefined` | `undefined` |


----------------------------------------------

view.DO : Experience Platform
