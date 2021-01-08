import { FetchService, OfflineFetchOptions } from './api/fetch-service'
import { ExperienceInformation, Experience } from '../models'
import { PreviewExperienceKey, getExperienceRequestUrl, getExperienceCSSUrl, getExperienceScriptUrl } from './api/conventions'

import { ApiService } from './api/api-service'
import { StorageService } from './data/storage-service'
import { SessionService } from './data/session-service'
import { logger, urlService, state } from '.'

export class ExperienceController {
  private api: ApiService
  public session: SessionService
  public storage: StorageService

  message: string
  fetchService: FetchService

  // TODO: Add experience state w/updates once a data-call is made

  constructor(
    private readonly document: Document,
    private debug: boolean,
    private readonly preview: boolean,
    private readonly loadAssets: boolean,
    private readonly xapiUrl: string,
    private readonly storyKey: string,
    private readonly userKey: string,
  ) {
    this.session = new SessionService(`dxp:${this.storyKey}`)
    this.storage = new StorageService(`dxp:${this.storyKey}`)

    const offlineOptions = new OfflineFetchOptions()
    offlineOptions.expires = 30 * 1000
    offlineOptions.debug = debug
    offlineOptions.retryDelay = 10 * 1000
    offlineOptions.cacheKeyGenerator = (_url, _o, hash) => hash

    this.fetchService = new FetchService(this.session, offlineOptions)

    this.api = new ApiService(this.debug, this.xapiUrl, this.fetchService)

    console.log('%cview%c.DO', 'color: #7566A0; font-size: 2em; font-family: Verdana;', 'color: #1A658F; font-size: 2em; font-family: Trebuchet MS; font-weight: 800')
  }

  async getExperience(): Promise<ExperienceInformation> {
    const experienceKey = urlService.parameters.xid || this.session.xid || this.storage.xid

    let experienceInfo: ExperienceInformation
    try {
      if (this.preview) {
        experienceInfo = await this.api.getPreviewExperience(this.storyKey, this.userKey)
      } else if (experienceKey) {
        experienceInfo = await (experienceKey == PreviewExperienceKey ? this.api.getPreviewExperience(this.storyKey, this.userKey) : this.api.getExperience(experienceKey))
      } else {
        experienceInfo = await this.api.getFunnelExperience(this.storyKey, this.userKey)
      }

      this.session.sessionId = experienceInfo.sessionId

      if (this.loadAssets) {
        if (experienceInfo.story.hasJsFile) {
          await this.addScript(getExperienceScriptUrl(this.xapiUrl, experienceInfo.story.key, experienceInfo.currentEpisodeKey))
        }

        if (experienceInfo.story.hasCSSFile) {
          await this.addStyleSheet(getExperienceCSSUrl(this.xapiUrl, experienceInfo.key, experienceInfo.story.key, experienceInfo.currentEpisodeKey))
        }
      }

      return experienceInfo
    } catch (error) {
      if (this.storage.xid) {
        this.storage.clear()
      }

      const conditions = this.storyKey ? `with key ${this.storyKey}` : `with funnel url: ${location.origin}`
      const message = `Unable to find an experience for story ${conditions} using XAPI: ${this.xapiUrl}`
      logger.error(message, error)
    }
  }

  private async refreshExperience(xid: string) {
    const experienceInfo = await this.api.getExperience(xid, true)
    if (experienceInfo) {
      state.experience = new Experience(this, experienceInfo)
    }
  }

  public async startSession(experience: ExperienceInformation): Promise<string> {
    if (this.preview || experience.key == PreviewExperienceKey) {
      this.debug = this.api.debug = true
      this.message = 'Preview Mode'
      logger.warn('You are viewing a sample experience in preview mode. Data and API calls are mocked.')
    } else if (this.debug) {
      this.message = 'Debug Mode' // TODO: Show in HTML
      logger.warn('You are viewing an experience in debug mode. API calls are mocked.')
      return 'test-session'
    } else {
      if (experience.story.persistent) {
        this.storage.xid = experience.key
      } else if (this.storage.xid) {
        this.storage.xid = null
      }

      const sessionId = await this.api.beginSession(experience.key, this.session.sessionId)
      if (sessionId) {
        this.session.sessionId = sessionId || experience.sessionId
      }

      return sessionId
    }
  }

  public async addScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const scriptElement = this.document.createElement('script')
        scriptElement.setAttribute('src', url)
        scriptElement.addEventListener('load', () => {
          resolve()
        })

        this.document.body.append(scriptElement)
      } catch (error) {
        reject(error)
      }
    })
  }

  public async addStyleSheet(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const styleElement = this.document.createElement('link')
        styleElement.setAttribute('href', url)
        styleElement.setAttribute('rel', 'stylesheet')
        styleElement.setAttribute('type', 'text/css')
        styleElement.addEventListener('load', () => {
          resolve()
        })

        this.document.querySelectorAll('head')[0].append(styleElement)
      } catch (error) {
        reject(error)
      }
    })
  }

  public async setData(xid: string, key: string, value: any): Promise<void> {
    await this.api.getRequest(xid, this.session.sessionId, 'set-data', { [key]: encodeURIComponent(value) })
    this.refreshExperience(xid)
  }

  public async setMilestone(xid: string, milestone: string): Promise<void> {
    await this.api.getRequest(xid, this.session.sessionId, 'set-milestone', { value: encodeURIComponent(milestone) })
    this.refreshExperience(xid)
  }

  public async recordEvent(xid: string, event: string): Promise<void> {
    await this.api.getRequest(xid, this.session.sessionId, 'record-event', { value: encodeURIComponent(event) })
    this.refreshExperience(xid)
  }

  public async setComplete(xid: string): Promise<void> {
    await this.api.getRequest(xid, this.session.sessionId, 'set-complete')
    this.refreshExperience(xid)
  }

  public async setConverted(xid: string, label?: string): Promise<void> {
    await this.api.getRequest(xid, this.session.sessionId, 'set-converted', label ? { label } : {})
    this.refreshExperience(xid)
  }

  public async setChildEntity(xid: string, ocid: string): Promise<void> {
    await this.api.getRequest(xid, this.session.sessionId, 'set-child-entity', { ocid })
    this.refreshExperience(xid)
  }

  public async repersonalize(xid: string, contactData: Record<string, string>): Promise<boolean> {
    await this.api.postRequest(xid, this.session.sessionId, 'repersonalize', contactData)
    return true
  }

  public unload(experienceKey: string, elapsed: number) {
    if (experienceKey == null) {
      return
    }

    const url = getExperienceRequestUrl(this.xapiUrl, experienceKey, 'set-view-time', `?seconds=${elapsed}`)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url)
    } else {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, false)
      xhr.send(null)
    }
  }

  public reset() {
    this.session.clear()
    this.storage.clear()
    logger.debug('Reset called. Experience cleared from session & storage')
  }

  toJSON() {
    return {}
  }
}
