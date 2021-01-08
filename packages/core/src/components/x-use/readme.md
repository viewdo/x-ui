# X-USE

This component makes a single reference to script and css sources. It can be used by HTML fragment to ensure a reference is made, without worry that it will create duplicate references.

If inline is present, the source would be nested inside this element, otherwise it is appended to the head.

## Usage

```html
<x-use script-src="<url>" style-src="<url>" inline />
```

## Examples

### Ensure Style Reference

```html
<html>
  <head></head>
  <body>
    <x-use style-src="assets/styles.css" />
  </body>
</html>
```

**Results**:

```html
<html>
  <head>
    <link rel="stylesheet" href="assets/styles.css" />
  </head>
  <body>
    <x-use style-src="assets/styles.css" />
  </body>
</html>
```

### Ensure Inline Reference

```html
<html>
  <head></head>
  <body>
    <x-use style-src="assets/styles.css" inline />
  </body>
</html>
```

**Results**:

```html
<html>
  <head></head>
  <body>
    <x-use style-src="assets/styles.css">
      <link rel="stylesheet" href="assets/styles.css" />
    </x-use>
  </body>
</html>
```

### Ensure Script References

```html
<html>
  <head></head>
  <body>
    <x-view url="/home">
      <x-use script-src="lib/script.js" />
    </x-view>
    <x-view url="/page-1">
      <x-use script-src="lib/script.js" />
    </x-view>
  </body>
</html>
```

**Results**:

```html
<html>
  <head>
    <script src="lib/script.js"></script>
  </head>
  <body>
    <x-view url="/home">
      <x-use script-src="lib/script.js" />
    </x-view>
    <x-view url="/page-1">
      <x-use script-src="lib/script.js" />
    </x-view>
  </body>
</html>
```

<!-- Auto Generated Below -->


## Properties

| Property                | Attribute    | Description                                                                                                  | Type                  | Default     |
| ----------------------- | ------------ | ------------------------------------------------------------------------------------------------------------ | --------------------- | ----------- |
| `inline` _(required)_   | `inline`     | When inline the link/script tags are rendered in-place rather than added to the head.                        | `boolean`             | `undefined` |
| `module` _(required)_   | `module`     | Import the script file as a module.                                                                          | `boolean`             | `undefined` |
| `noModule` _(required)_ | `no-module`  | Declare the script only for use when modules aren't supported                                                | `boolean`             | `undefined` |
| `noRender`              | `no-render`  | If set, disables auto-rendering of this instance. To fetch the contents change to false or remove attribute. | `boolean`             | `false`     |
| `nowait` _(required)_   | `nowait`     | INTERNAL - disables the DOM onload await to finish rendering                                                 | `boolean`             | `undefined` |
| `scriptSrc`             | `script-src` | The script file to reference.                                                                                | `string \| undefined` | `undefined` |
| `styleSrc`              | `style-src`  | The css file to reference                                                                                    | `string \| undefined` | `undefined` |


----------------------------------------------

view.DO : Experience Platform
