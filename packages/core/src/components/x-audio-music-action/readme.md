# X-AUDIO-MUSIC-ACTION

This element represents an action to be fired. This specialized action encapsulates required parameters- needed for audio-based actions, for music.

## Usage

See the [audio](/audio) systems documentation.

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



### `sendAction(data?: Record<string, any> | undefined) => Promise<void>`

Send this action to the the action messaging system.

#### Returns

Type: `Promise<void>`




----------------------------------------------

view.DO : Experience Platform
