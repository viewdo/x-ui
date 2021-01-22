import { warnIf } from '../logging';
import { VisitStrategy } from './interfaces';
import { storageAvailable } from './utils/browser-utils';

const supportsSession = storageAvailable(window, 'sessionStorage')
warnIf(!supportsSession, 'session-storage is not supported')

const supportsStorage = storageAvailable(window, 'localStorage')
warnIf(!supportsStorage, 'local-storage is not supported')

const visitKey = 'visits'

function parseVisits(visits: string | null): string[] {
  return JSON.parse(visits || '[]')
}

function stringifyVisits(visits: string[]) {
  return JSON.stringify(visits || '[]')
}

export function getSessionVisits() {
  if (!supportsSession) {
    return []
  }

  const visits = sessionStorage.getItem(visitKey)
  return parseVisits(visits)
}

export function setSessionVisits(visits: string[]) {
  if (supportsSession) {
    sessionStorage.setItem(visitKey, stringifyVisits(visits))
  }
}

export function getStoredVisits() {
  if (!supportsStorage) {
    return []
  }

  const storage = localStorage.getItem(visitKey)
  return parseVisits(storage)
}

export function setStoredVisits(visits: string[]) {
  if (supportsStorage) {
    localStorage.setItem(visitKey, stringifyVisits(visits))
  }
}

export function hasVisited(url: string) {
  return getSessionVisits().includes(url) || getStoredVisits().includes(url)
}

export function recordVisit(visit: VisitStrategy, url: string) {
  if (visit == VisitStrategy.once) {
    storeVisit(url)
  } else {
    markVisit(url)
  }
}

export function markVisit(url: string) {
  const sessionVisits = getSessionVisits()
  if (sessionVisits.includes(url)) return
  setSessionVisits([...new Set([...sessionVisits, url])])
}

export function storeVisit(url: string) {
  const storedVisits = getStoredVisits()
  if (storedVisits.includes(url)) return
  setStoredVisits([...new Set([...storedVisits, url])])
}

export function clearVisits() {
  setSessionVisits([])
  setStoredVisits([])
}
