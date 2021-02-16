# X-AUDIO-LOAD-SOUND

This component declares audio used within this **`<x-view-do>`** route. The **`<x-audio-sound-load>`** represents audio files and play behaviors. They are all sent to the global-audio player to pre-load or play when the route is active. The player manages them according to their settings.

## Usage

```html
<x-view-do>
  <x-audio-sound-load mode="queue|play|load" track-id="<unique-id>" src="<url>" discard="route|next|none" track>
  </x-audio-sound-load>
</x-view-do>
```

### Simple

```html
<x-view-do>
  <x-audio-sound-load track-id="<unique-id>" src="<url>"></x-audio-sound-load>
</x-view-do>
```

## Timed

For timed audio, the audio is sent up front for pre-loading. Then at the given time, a separate **`<x-audio-sound-action>`** event is dispatched to play it at a given time. This way, the audio is likely to play on time without any buffering.

The following demonstrates how to load a track, and wait 10 seconds until it plays. It's important to remember this time can be paused by the user, so it's could be any amount of time if a video is playing.

```html
<x-view-do>
  <x-audio-sound-load track-id="audio1" src="<url>"> </x-audio-sound-load>
  <x-action-activator activate="AtTime" time="10">
    <x-audio-sound-action command="start" track-id="audio1"> </x-audio-sound-action>
  </x-action-activator>
</x-view-do>
```

### Mode

* **queue**: (default) plays after the previous audio is complete or when it's requested.
* **play**: stop any playing audio and play now, buffering be-damned.
* **wait**: wait for an event action before playing, any currently playing audio continues.

#### Discard

- video: when any video plays (default for sound)
- state: state changes
- event: wait for a stop event (or any other activation)
- none: loop until stopped or updated by new state (default for music)

#### Track

If audio has replay set to true, re-entry to the originating state will re-activate the audio if the previous audio has been deactivated. The default is false.

<!-- Auto Generated Below -->


## Properties

| Property               | Attribute  | Description                                                                                                 | Type                                                                    | Default                 |
| ---------------------- | ---------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------- |
| `discard`              | `discard`  | The discard strategy the player should use for this file.                                                   | `DiscardStrategy.Next \| DiscardStrategy.None \| DiscardStrategy.Route` | `DiscardStrategy.Route` |
| `mode`                 | `mode`     | This is the topic this action-command is targeting.                                                         | `LoadStrategy.Load \| LoadStrategy.Play \| LoadStrategy.Queue`          | `LoadStrategy.Load`     |
| `src` _(required)_     | `src`      | The path to the audio-file.                                                                                 | `string`                                                                | `undefined`             |
| `track`                | `track`    | Set this attribute to have the audio file tracked in session effectively preventing it from playing again.. | `boolean`                                                               | `false`                 |
| `trackId` _(required)_ | `track-id` | The identifier for this music track                                                                         | `string`                                                                | `undefined`             |


----------------------------------------------

view.DO : Experience Platform
