import { UrlInfo } from '../models/urlinfo'

export class UrlService {
  public info: UrlInfo

  constructor(currentUrl: string = window.location.href) {
    this.info = new UrlInfo(currentUrl)
  }

  get experienceKey(): string {
    return this.info.parameters.xid
  }

  get debug(): boolean {
    return this.info.parameters.debug !== undefined
  }

  get preview(): boolean {
    return this.info.parameters.preview !== undefined
  }

  get storyKey(): string {
    return this.info.parameters.storyKey || this.info.hash
  }

  get userKey(): string {
    return this.info.parameters.userKey
  }

  get parameters(): Record<string, string> {
    return this.info.parameters
  }

  get search(): string {
    return this.info.search
  }
}
