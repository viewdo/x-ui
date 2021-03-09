import { getDataProvider } from '../data/factory'
import { IDataProvider } from '../data/interfaces'

const AppScrollKey = 'scrollPositions'
export class ScrollHistory {
  scrollPositions: Map<string, [number, number]>
  provider?: IDataProvider | null
  constructor(private win: Window) {
    this.scrollPositions = new Map<string, [number, number]>()

    getDataProvider('session').then(provider => {
      this.provider = provider
      provider?.get(AppScrollKey).then(scrollData => {
        if (scrollData)
          this.scrollPositions = new Map(JSON.parse(scrollData))
      })
    })

    if (win && 'scrollRestoration' in win.history) {
      win.history.scrollRestoration = 'manual'
    }
  }

  set(key: string, value: [number, number]) {
    this.scrollPositions.set(key, value)
    if (this.provider) {
      const arrayData: Array<[string, [number, number]]> = []

      this.scrollPositions.forEach((v, k) => {
        arrayData.push([k, v])
      })
      this.provider.set(AppScrollKey, JSON.stringify(arrayData))
    }
  }

  get(key: string) {
    return this.scrollPositions.get(key)
  }

  has(key: string) {
    return this.scrollPositions.has(key)
  }

  capture(key: string) {
    this.set(key, [this.win.scrollX, this.win.scrollY])
  }
}
