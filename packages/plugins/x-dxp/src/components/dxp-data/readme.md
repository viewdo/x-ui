# dxp-data

<!-- Auto Generated Below -->

## Properties

| Property           | Attribute | Description                                                                                                                                                                          | Type                  | Default     |
| ------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- | ----------- |
| `default`          | `default` | A default value to display if the data in get is not found.                                                                                                                          | `string \| undefined` | `undefined` |
| `get` _(required)_ | `get`     | The JS-based expression to capture data from the above model.                                                                                                                        | `string`              | `undefined` |
| `modify`           | `modify`  | A pipe separated list of modifier expressions to modify the captured data. clip: length truncate: length date format: expression lowercase uppercase capitalize size encode currency | `string \| undefined` | `undefined` |

---

_Built with [StencilJS](https://stenciljs.com/)_
