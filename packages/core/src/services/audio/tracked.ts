import { audioState } from './state'

export function hasPlayed(trackId: string) {
  return audioState.playedAudio.includes(trackId)
}

export function trackPlayed(trackId: string) {
  audioState.playedAudio = [...new Set([...audioState.playedAudio, trackId])]
}

export function clearTracked() {
  audioState.playedAudio = []
}
