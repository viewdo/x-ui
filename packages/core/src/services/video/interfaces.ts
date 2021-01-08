export const VIDEO_TOPIC = 'video'

export enum VIDEO_COMMANDS {
  Play = 'play',
  Pause = 'pause',
  Resume = 'resume',
  Mute = 'mute',
}

export enum VIDEO_EVENTS {
  Played = 'played',
  Paused = 'paused',
  Resumed = 'resumed',
  Muted = 'muted',
  Unmuted = 'muted',
  Ended = 'ended',
}

export class VideoRequest {
  value: any
}
