/* istanbul ignore file */

export const AUDIO_TOPIC = 'audio'

export enum AUDIO_COMMANDS {
  Enable = 'enable',
  Disable = 'disable',
  Play = 'play',
  Queue = 'queue',
  Load = 'load',
  Start = 'start',
  Pause = 'pause',
  Resume = 'resume',
  Mute = 'mute',
  Volume = 'volume',
  Seek = 'seek',
}

export enum AUDIO_EVENTS {
  Played = 'played',
  Queued = 'queued',
  Dequeued = 'dequeued',
  Loaded = 'loaded',
  Started = 'started',
  Paused = 'paused',
  Resumed = 'resumed',
  Stopped = 'stopped',
  Muted = 'muted',
  Ended = 'ended',
  Looped = 'looped',
  Errored = 'errored',
  Discarded = 'discarded',
  SoundChanged = 'muted',
}

export enum DiscardStrategy {
  Route = 'route',
  Next = 'next',
  None = 'none',
}

export enum LoadStrategy {
  Queue = 'queue',
  Play = 'play',
  Load = 'load',
}

export enum AudioType {
  Sound = 'sound',
  Music = 'music',
}
