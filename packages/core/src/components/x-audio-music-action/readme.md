# X-AUDIO-MUSIC-ACTION



## Usage



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute  | Description                        | Type                                                             | Default     |
| ---------------------- | ---------- | ---------------------------------- | ---------------------------------------------------------------- | ----------- |
| `command` _(required)_ | `command`  | The command to execute.            | `"mute" \| "pause" \| "resume" \| "seek" \| "start" \| "volume"` | `undefined` |
| `trackId`              | `track-id` | The track to target.               | `string \| undefined`                                            | `undefined` |
| `value`                | `value`    | The value payload for the command. | `boolean \| number \| string \| undefined`                       | `undefined` |


## Methods

### `getAction() => Promise<EventAction<any>>`

Get the underlying actionEvent instance. Used by the x-action-activator element.

#### Returns

Type: `Promise<EventAction<any>>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
