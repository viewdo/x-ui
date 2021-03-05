# X-APP-THEME

The `<x-app-theme>` component checks for the preferred light/dark theme preference of the
user and sets the interface state: theme, accordingly.

## Usage

Add this tag somewhere close to the top of the application to auto-adjust the theme class
based on the user's preferences.

Use it in conjunction with the [\<x-app-theme-dark\>](/components/x-app-theme-dark) component,
to gives users control of which theme should be applied.

### Standard

```html
<x-app-theme></x-app-theme>
```

### No Changes

```html
<x-app-theme skip-class></x-app-theme>
```

### Custom Dark Class

```html
<x-app-theme dark-class="midnight"></x-app-theme>
```

<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                                                                                  | Type      | Default  |
| ----------- | ------------ | -------------------------------------------------------------------------------------------- | --------- | -------- |
| `darkClass` | `dark-class` | Change the class name that is added to the body tag when the theme is determined to be dark. | `string`  | `'dark'` |
| `skipClass` | `skip-class` | Skip adding the class to the body tag, just update the interface state.                      | `boolean` | `false`  |


----------------------------------------------

view.DO : Experience Platform
