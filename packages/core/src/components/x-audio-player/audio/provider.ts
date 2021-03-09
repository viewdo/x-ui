import { AudioType } from '../../../services/audio/interfaces'
import {
  DATA_EVENTS,
  IDataProvider,
} from '../../../services/data/interfaces'
import { EventEmitter } from '../../../services/events/emitter'
import { AudioActionListener } from './actions'

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
      case 'loadedSound':
        return this.audioListener.loaded[AudioType.Sound]
          ? JSON.stringify(this.audioListener.loaded[AudioType.Sound])
          : null
      case 'queuedMusic':
        return this.audioListener.queued[AudioType.Music]
          ? JSON.stringify(this.audioListener.queued[AudioType.Music])
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
