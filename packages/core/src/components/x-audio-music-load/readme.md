# X-AUDIO-LOAD-MUSIC

This component declares audio used within this [\<x-app-view-do\>](/components/x-app-view-do) route. The [\<x-audio-music-load\>](/components/x-audio-music-load) represents audio files and play behaviors. They are sent to the audio player to pre-load or play when the route is active. The player manages them according to their settings.

## Usage

```html
<x-app-view-do>
  <x-audio-music-load
    mode="play|load"
    track-id="<unique-id>"
    src="<url>"
    discard="route|video|next|none"
    loop
    track
  ></x-audio-music-load>
</x-app-view-do>
```

### Simple

```html
<x-app-view-do>
  <x-audio-music-load track-id="<unique-id>" src="<url>"></x-audio-music-load>
</x-app-view-do>
```

```html
<x-app-view-do>
  <x-audio load="queue" id="<unique-id>" src="<url>" discard="none" loop></x-audio>
</x-app-view-do>
```

#### Mode

- **queue**: (default) plays after the previous audio is complete or when it's requested.
- **play**: stop any playing audio and play now, buffering be-damned.
- **wait**: wait for an action before playing, any currently playing audio continues.

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
| `loop`                 | `loop`     | Set this to true to have the audio file loop.                                                               | `boolean`                                                               | `false`                 |
| `mode`                 | `mode`     | This is the topic this action-command is targeting.                                                         | `LoadStrategy.Load \| LoadStrategy.Play \| LoadStrategy.Queue`          | `LoadStrategy.Queue`    |
| `src` _(required)_     | `src`      | The path to the audio-file.                                                                                 | `string`                                                                | `undefined`             |
| `track`                | `track`    | Set this attribute to have the audio file tracked in session effectively preventing it from playing again.. | `boolean`                                                               | `false`                 |
| `trackId` _(required)_ | `track-id` | The identifier for this music track                                                                         | `string`                                                                | `undefined`             |


----------------------------------------------

view.DO : Experience Platform
