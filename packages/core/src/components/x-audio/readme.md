# X-AUDIO

This component is responsible for playing audio requested via the [action](/actions) bus. Internally it holds two players, one for music and another for sounds.

The audio-tracks are declaratively defined in HTML to respond to user interactions. Unlike a typical playlist, the audio items are configured with behavior rules that help orchestrate overlapping sound and music sound.

## Display

This player can be configured to display in full or minimal mode. When displayed, it shows a single icon when a file is loaded and a different icon when it is playing. Clicking it should toggle pause for both of the players simultaneously.

## Usage

```html
<x-audio display debug> </x-audio>
```

While it can be placed anywhere, only ONE player is allowed within an HTML document. Loading a second element will have no effect.

Once in-place, the [\<x-audio\>](/components/x-audio) listens on the **audio** topic for commands.

> Note: This component subscribes to route-change notifications - as some audio clips are meant to end when the route changes.

## Audio Actions

To operate the player, it is easiest to just use the `<x-audio-load-*>` components to pre-load the audio. Then declare the actions using the [\<x-action-activator\>](/components/x-action-activator) component.

```html
<x-app-view-do>
  <x-audio-sound-load track-id='<unique-id>' src='<url>'>
  </x-audio-sound-load>
  <x-action-activator ...>
    <x-audio-sound-action
      command='<command>'
      track-id='<id>'
      value='<value>'
    ></x-audio-sound-action>
  </x-action-activator>
</x-app-view-do>
```

### Commands

#### start

This command instructs the player to immediately play the given pre-loaded track based on the **id**. If the track isn't present in the bin, this command is ignored.

**Data**:

```json
{
  'id': '<id>'
}
```

#### pause

This command pauses active audio, if something is playing.

#### resume

This command resumes audio if it was paused.

#### mute

This command instructs the player to set its own 'muted' property to the value in the payload. Meaning the same command is used for mute and un-mute.

**Data**:

```json
{
  'mute': true | false
}
```

#### volume

Set the audio player volume at a level 0 to 100.

**Data**:

```json
{
  'id': '<id>'
}
```

#### seek \*

Set the audio track to to the given time in seconds, but only if the **id** matches the that of the active track. Otherwise, it is ignored. If the current track is paused, it will remain paused, at the requested time. Otherwise, the track is changed audibly.

**Data**:

```json
{
  'id': '<id>',
  'time': <time>
}
```

#### Other Commands

#### play

This command instructs the player to immediately play this audio clip. If a track is currently playing (on the respective player), it is stopped and discarded.

**Data**:

```json
{
  'id': '<id>',
  'type': 'music|sound',
  'src': '<file>',
  'discard': '<discard-strategy>',
  'loop': false,
  'track': false
}
```

#### queue

This is the primary method for loading audio-tracks to the player. It instructs the player to play this as soon as the player becomes available, but after anything that is currently playing.

**Data**:

```json
{
  'id': '<id>',
  'type': 'music|sound',
  'src': '<file>',
  'discard': '<discard-strategy>',
  'loop': false,
  'track': false
}
```

#### load

This command instructs the player to pre-load the file with the browser but do not play it until instructed by the **play** command, presumably at a given time. This method is helpful for large audio tracks that need to be ready to go at exactly the right time.

**Data**:

```json
{
  'id': '<id>',
  'type': 'music|sound',
  'src': '<file>',
  'discard': '<deactivation-strategy>',
  'loop': false,
  'track': false
}
```

### Looping

Only the music player will support looping. Default is true. Looping audio loops until it's discard event occurs.

If audio is set to loop with no deactivation, any new configuration will end it. For instance, if new audio is configured to activate in a queued fashion, the looping audio should stop and allowing the queued audio to play when it ends.

### Discard Strategy

Each audio track-request defines when it should be stopped and removed from the queue. This allows for music music to plays between routes. By default, a route-change will empty the queue of any unplayed audio.

- **route**: When the route changes (default for unmarked)
- **video**: When a video plays
- **next**: Play/queue until route or another audio is queued.
- **none**: Play until a new track is played (default for music)

### Track

If audio has tracking set to true, the player will store the track id in session to ensure it doesn't play again, even if the browser was refreshed.

### Volume Easing

Hard discards or play-src should ease out the audio with a .5 second fade-out before playing the next clip.

<!-- Auto Generated Below -->


## Properties

| Property           | Attribute             | Description                                                                                                                                    | Type      | Default          |
| ------------------ | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------- |
| `debug`            | `debug`               | Use debug for verbose logging. Useful for figuring thing out.                                                                                  | `boolean` | `false`          |
| `display`          | `display`             | The display mode for this player. The display is merely a facade to manage basic controls. No track information or duration will be displayed. | `boolean` | `false`          |
| `howlerVersion`    | `howler-version`      | The Howler.js Script Reference                                                                                                                 | `string`  | `'2.2.1'`        |
| `muteOffIconClass` | `mute-off-icon-class` | Mute Off Icon Url                                                                                                                              | `string`  | `'mute-off-img'` |
| `muteOnIconClass`  | `mute-on-icon-class`  | Mute ON Icon Url                                                                                                                               | `string`  | `'mute-on-img'`  |
| `pauseIconClass`   | `pause-icon-class`    | Pause Icon Url                                                                                                                                 | `string`  | `'pause-img'`    |
| `playIconClass`    | `play-icon-class`     | Play Icon Url                                                                                                                                  | `string`  | `'play-img'`     |


----------------------------------------------

view.DO Experience Components
