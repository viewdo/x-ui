import { warnIf } from '../logging'
import { onRoutingStateChange, routingState } from './state'
import { storageAvailable } from './utils/browser-utils'

const supportsSession = storageAvailable(window, 'sessionStorage')
warnIf(!supportsSession, 'session-storage is not supported')

const supportsStorage = storageAvailable(window, 'localStorage')
warnIf(!supportsStorage, 'local-storage is not supported')

const visitKey = 'visits'
let memoryState: string | any[] = []

function parseVisits(visits: string | null) {
  return JSON.parse(visits || '[]')
}

function stringifyVisits(visits: string[]) {
  return JSON.stringify(visits || '[]')
}

export async function getSessionVisits() {
  if (!supportsSession) {
    return memoryState
  }

  const visits = sessionStorage.getItem(visitKey)
  return parseVisits(visits)
}

export async function setSessionVisits(visits: string[]) {
  if (supportsSession) {
    sessionStorage.setItem(visitKey, stringifyVisits(visits))
  } else {
    memoryState = [...new Set([...visits, memoryState])]
  }
}

export async function getStoredVisits() {
  if (!supportsStorage) {
    return memoryState
  }

  const storage = localStorage.getItem(visitKey)
  return parseVisits(storage)
}

export async function setStoredVisits(visits: string[]) {
  if (supportsStorage) {
    localStorage.setItem(visitKey, stringifyVisits(visits))
  } else {
    memoryState = [...new Set([...visits, memoryState])]
  }
}

onRoutingStateChange('storedVisits', async (a) => setStoredVisits(a))
onRoutingStateChange('sessionVisits', async (a) => setSessionVisits(a))

getStoredVisits().then((v) => {
  routingState.storedVisits = v
})

getSessionVisits().then((v) => {
  routingState.sessionVisits = v
})

export function hasVisited(url: string) {
  return routingState.sessionVisits.includes(url) || routingState.storedVisits.includes(url)
}

export function markVisit(url: string) {
  routingState.sessionVisits = [...new Set([...routingState.sessionVisits, url])]
}

export function storeVisit(url: string) {
  routingState.storedVisits = [...new Set([...routingState.storedVisits, url])]
}

export function clearVisits() {
  routingState.sessionVisits = []
  routingState.storedVisits = []
}
