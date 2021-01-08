# X-MARKDOWN

## Usage

```html
<head>
  <script src="https://cdn.jsdelivr.net/gh/markedjs/marked@1/marked.min.js"></script>
</head>
```

```html
<!-- Simply set the `src` attribute and win -->
<x-markdown src="https://example.com/markdown.md"></x-markdown>
```

## Styling

By default, there is no styling. The HTML is rendered to the page without styles. For basic styles, you can include the Marked.js css file in the head:

```html
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sindresorhus/github-markdown-css@4/github-markdown.min.css" />
</head>
```

### Code Styling

```html
<head>
  <script src="https://cdn.jsdelivr.net/gh/markedjs/marked@1/marked.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/PrismJS/prism@1/prism.min.js" data-manual=""></script>
  <script src="https://cdn.jsdelivr.net/gh/PrismJS/prism@1/plugins/autoloader/prism-autoloader.min.js"></script>

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/PrismJS/prism@1/themes/prism.min.css" />
</head>
```

## Inline Markdown

You can pass in your markdown inline too.

```html
<!-- Do not set the `src` attribute -->
<x-markdown>
  <!-- Write your markdown inside a `<script type="text/markdown">` tag -->
  <script type="text/markdown">
    # **This** is my [markdown](https://example.com)
  </script>
</x-markdown>
```

<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description                                                                                                  | Type                  | Default     |
| ---------- | ----------- | ------------------------------------------------------------------------------------------------------------ | --------------------- | ----------- |
| `baseUrl`  | `base-url`  | Base Url for embedded links                                                                                  | `string \| undefined` | `undefined` |
| `noRender` | `no-render` | If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute. | `boolean`             | `false`     |
| `src`      | `src`       | Remote Template URL                                                                                          | `string \| undefined` | `undefined` |


----------------------------------------------

view.DO : Experience Platform
