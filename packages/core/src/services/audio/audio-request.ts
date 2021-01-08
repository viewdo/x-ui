import { AudioType } from './interfaces'

export class AudioRequest {
  trackId?: string
  type!: AudioType
  value: any
}
