import { storageAvailable } from '../utils/browser-utils';

const AppScrollKey = 'scrollPositions'
export class ScrollHistory {
  scrollPositions: Map<string, [number, number]>
  constructor(
    private win: Window,
    ) {
    this.scrollPositions = new Map<string, [number, number]>();
    if (storageAvailable(win, 'sessionStorage')) {
      const scrollData = win.sessionStorage.getItem(AppScrollKey)
      if (scrollData )
        this.scrollPositions = new Map(JSON.parse(scrollData))
    }

    if (win && 'scrollRestoration' in win.history) {
      window.history.scrollRestoration = 'manual'
    }
  }

  set(key: string, value: [number, number]) {
    this.scrollPositions.set(key, value)
    if (storageAvailable(this.win, 'sessionStorage')) {
      const arrayData: Array<[string, [number, number]]> = []

      this.scrollPositions.forEach((v, k) => {
        arrayData.push([k, v])
      })
      this.win.sessionStorage.setItem(AppScrollKey, JSON.stringify(arrayData))
    }
  }


  get(key: string) {
    return this.scrollPositions.get(key);
  }

  has(key: string) {
    return this.scrollPositions.has(key);
  }

  capture (key: string){
    this.set(key, [this.win.scrollX, this.win.scrollY])
  }
}