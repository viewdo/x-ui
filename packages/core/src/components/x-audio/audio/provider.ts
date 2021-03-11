import { EventEmitter } from '../../../services/common/emitter'
import {
  DATA_EVENTS,
  IDataProvider,
} from '../../../services/data/interfaces'
import { AudioActionListener } from './actions'
import { AudioType } from './interfaces'

export class AudioDataProvider implements IDataProvider {
  changed: EventEmitter
  listenerSubscription!: () => void
  constructor(private audioListener: AudioActionListener) {
    this.changed = new EventEmitter()
    this.listenerSubscription = this.audioListener.changed.on(
      'changed',
      () => {
        this.changed.emit(DATA_EVENTS.DataChanged, {
          provider: 'audio',
        })
      },
    )
  }

  async get(key: string): Promise<string | null> {
    switch (key) {
      // Global
      case 'hasAudio':
        return this.audioListener.hasAudio.toString()
      case 'isPlaying':
        return this.audioListener.isPlaying.toString()

      // Music files
      case 'loadedMusic':
        return this.audioListener.loaded[AudioType.Music]
          ? JSON.stringify(this.audioListener.loaded[AudioType.Music])
          : null
      case 'queuedMusic':
        return this.audioListener.queued[AudioType.Music]
          ? JSON.stringify(this.audioListener.queued[AudioType.Music])
          : null
      case 'currentMusic':
        return this.audioListener.onDeck[AudioType.Music]
          ? JSON.stringify(this.audioListener.onDeck[AudioType.Music])
          : null

      // Sound files
      case 'loadedSounds':
        return this.audioListener.loaded[AudioType.Sound]
          ? JSON.stringify(this.audioListener.loaded[AudioType.Sound])
          : null
      case 'queuedSounds':
        return this.audioListener.queued[AudioType.Sound]
          ? JSON.stringify(this.audioListener.queued[AudioType.Sound])
          : null
      case 'currentSound':
        return this.audioListener.onDeck[AudioType.Sound]
          ? JSON.stringify(this.audioListener.onDeck[AudioType.Sound])
          : null

      default:
        return null
    }
  }

  async set(_key: string, _value: any): Promise<void> {
    // do nothing
  }

  destroy() {
    this.listenerSubscription()
  }
}
