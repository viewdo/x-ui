import { VisitStrategy } from './interfaces'
import {
  clearVisits,
  getSessionVisits,
  getStoredVisits,
  hasVisited,
  markVisit,
  recordVisit,
  storeVisit,
} from './visits'

describe('visits', () => {
  it('markVisit', async () => {
    markVisit('/fake-url')

    expect(hasVisited('/fake-url')).toBe(true)
    clearVisits()
  })

  it('storeVisit', async () => {
    storeVisit('/fake-url')

    expect(hasVisited('/fake-url')).toBe(true)
    clearVisits()
  })

  it('recordVisit: always', async () => {
    recordVisit(VisitStrategy.always, '/fake-url')

    expect(hasVisited('/fake-url')).toBe(true)

    let visits = getStoredVisits()
    expect(visits).not.toContain('/fake-url')
    visits = getSessionVisits()

    expect(visits).toContain('/fake-url')

    clearVisits()
  })

  it('recordVisit: once', async () => {
    recordVisit(VisitStrategy.once, '/fake-url')

    expect(hasVisited('/fake-url')).toBe(true)

    let visits = getStoredVisits()
    expect(visits).toContain('/fake-url')
    visits = getSessionVisits()

    expect(visits).not.toContain('/fake-url')

    clearVisits()
  })
})
