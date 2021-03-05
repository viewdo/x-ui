# X-AUDIO-SOUND-ACTION

This element represents an action to be fired. This specialized action encapsulates required parameters needed for audio-based actions, for sound.

## Usage

See the [audio](/audio) systems documentation.

<!-- Auto Generated Below -->


## Properties

| Property  | Attribute  | Description                        | Type                                                                                                                                                                                                                                                                    | Default               |
| --------- | ---------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `command` | `command`  | The command to execute.            | `AUDIO_COMMANDS.Disable \| AUDIO_COMMANDS.Enable \| AUDIO_COMMANDS.Load \| AUDIO_COMMANDS.Mute \| AUDIO_COMMANDS.Pause \| AUDIO_COMMANDS.Play \| AUDIO_COMMANDS.Queue \| AUDIO_COMMANDS.Resume \| AUDIO_COMMANDS.Seek \| AUDIO_COMMANDS.Start \| AUDIO_COMMANDS.Volume` | `AUDIO_COMMANDS.Play` |
| `trackId` | `track-id` | The track to target.               | `string \| undefined`                                                                                                                                                                                                                                                   | `undefined`           |
| `value`   | `value`    | The value payload for the command. | `boolean \| number \| string \| undefined`                                                                                                                                                                                                                              | `undefined`           |


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
