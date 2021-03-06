# X-APP-AUTOPLAY

The `<x-app-autoplay>` component displays a checkbox to control the autoplay setting used for video playback - as well as automatic navigation to the next page, when a video ends.

Default: enabled

## Usage

Add the `<x-app-autoplay>` component to any page to allow the user to adjust the autoplay setting. You can style it using standard CSS and if necessary, add CSS styles directly to the input element using the **classes** attribute.

```html
<x-app-autoplay ...>
</x-app-autoplay>
```

<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                            | Type                  | Default     |
| -------------- | --------------- | ------------------------------------------------------ | --------------------- | ----------- |
| `classes`      | `classes`       | Any classes to add to the input-element directly.      | `string \| undefined` | `undefined` |
| `dataProvider` | `data-provider` | The data provider to store the audio-enabled state in. | `string`              | `'storage'` |
| `inputId`      | `input-id`      | The id field to add to the input-element directly.     | `string \| undefined` | `undefined` |


----------------------------------------------

view.DO : Experience Platform
