# X-LINK

The element should be used in-place of an **`a`** tag to navigate without refreshing the page. This element supports an active-class that will be applied when the route in **href** matches the route of the app. This is helpful for menus, bread-crumbs and tabs.

## Usage

````html
<x-link 
  href="/route">
  ...
</x-link>
````

````html
<x-link 
  href="/route"
  custom="div">
  ...
</x-link>
````




<!-- Auto Generated Below -->


## Properties

| Property            | Attribute          | Description | Type                  | Default         |
| ------------------- | ------------------ | ----------- | --------------------- | --------------- |
| `activeClass`       | `active-class`     |             | `string`              | `'link-active'` |
| `anchorClass`       | `anchor-class`     |             | `string \| undefined` | `undefined`     |
| `anchorId`          | `anchor-id`        |             | `string \| undefined` | `undefined`     |
| `anchorRole`        | `anchor-role`      |             | `string \| undefined` | `undefined`     |
| `anchorTabIndex`    | `anchor-tab-index` |             | `string \| undefined` | `undefined`     |
| `anchorTitle`       | `anchor-title`     |             | `string \| undefined` | `undefined`     |
| `ariaHaspopup`      | `aria-haspopup`    |             | `string \| undefined` | `undefined`     |
| `ariaLabel`         | `aria-label`       |             | `string \| undefined` | `undefined`     |
| `ariaPosinset`      | `aria-posinset`    |             | `string \| undefined` | `undefined`     |
| `ariaSetsize`       | `aria-setsize`     |             | `number \| undefined` | `undefined`     |
| `custom`            | `custom`           |             | `string`              | `'a'`           |
| `exact`             | `exact`            |             | `boolean`             | `false`         |
| `href` _(required)_ | `href`             |             | `string`              | `undefined`     |
| `strict`            | `strict`           |             | `boolean`             | `true`          |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
