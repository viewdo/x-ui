/* istanbul ignore file */

import { AudioInfo } from '../../../../services/audio/interfaces'
import { EventEmitter } from '../../../../services/events/emitter'

export class AudioTrack {
  play: () => number = () => 0
  pause: () => any = () => this
  fade: () => any = () => this
  stop: () => any = () => this
  mute: () => any = () => this
  state: () => string = () => 'loaded'
  seek: (_time: number) => any = (_time: number) => this
  volume: (_value: number) => any = (_value: number) => this
  events: EventEmitter = new EventEmitter()
  createSound = (
    info: AudioInfo,
    onload: any,
    onend: any,
    onerror: any,
  ) => {
    const instance = Object.assign(new AudioTrack(), info, {
      onload,
      onend,
      onerror,
    })
    onload()
    return instance as AudioTrack
  }
}
