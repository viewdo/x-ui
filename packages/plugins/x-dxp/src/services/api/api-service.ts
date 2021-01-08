import { FetchService } from './fetch-service'
import { getExperienceRequestUrl, getErrorLogUrl, getFunnelExperienceUrl, getPreviewExperienceUrl } from './conventions'
import { urlService, logger } from '..'
import { ExperienceInformation } from '../..'
import { ApiResponse } from '../../models/apiresponse'

const SessionHeaderKey = 'dxp-session-id'

export class ApiService {
  constructor(public debug: boolean, public readonly xapiUrl: string, public readonly fetchService: FetchService) {}

  private getHeaders(sessionId?: string) {
    return {
      [SessionHeaderKey]: sessionId || '',
      'Content-Type': 'application/json',
    }
  }

  public async getFunnelExperience(storyKey: string, userKey: string): Promise<ExperienceInformation> {
    const url = getFunnelExperienceUrl(this.xapiUrl, storyKey, userKey, urlService.search)

    const response = await this.fetchService.fetch(
      url,
      {
        headers: this.getHeaders(),
      },
      true,
      false,
    )
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    const data = await response.json()

    return new ExperienceInformation(data)
  }

  public async getPreviewExperience(storyKey: string, userKey: string): Promise<ExperienceInformation> {
    const url = getPreviewExperienceUrl(this.xapiUrl, storyKey, userKey, urlService.search)

    const response = await this.fetchService.fetch(
      url,
      {
        headers: this.getHeaders(),
      },
      false,
    )

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    const data = await response.json()

    return new ExperienceInformation(data)
  }

  public async getExperience(experienceKey: string, renew = false): Promise<ExperienceInformation> {
    const url = getExperienceRequestUrl(this.xapiUrl, experienceKey, 'details', urlService.search)

    const response = await this.fetchService.fetch(
      url,
      {
        headers: this.getHeaders(),
      },
      true,
      renew,
      10,
    )

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    const data = await response.json()
    return new ExperienceInformation(data)
  }

  public async beginSession(experienceKey: string, sessionId: string): Promise<string> {
    const url = getExperienceRequestUrl(this.xapiUrl, experienceKey, 'session', urlService.search)
    const response = await this.fetchService.fetch(
      url,
      {
        headers: this.getHeaders(sessionId),
      },
      true,
      false,
    )

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    return response.headers[SessionHeaderKey]
  }

  public async getRequest(experienceKey: string, sessionId: string, path: string, parameters: Record<string, string> = {}): Promise<boolean> {
    parameters = Object.assign(parameters, urlService.parameters || {})
    const queryString = Object.keys(parameters)
      .filter((k) => k && parameters[k])
      .map((key) => {
        return key + '=' + encodeURI(parameters[key])
      })
      .join('&')

    const url = getExperienceRequestUrl(this.xapiUrl, experienceKey, path, `?${queryString}`)

    if (this.debug) {
      logger.log('Fake call to: GET' + url)
      return true
    }

    try {
      const response = await this.fetchService.fetch(
        url,
        {
          headers: this.getHeaders(sessionId),
        },
        true,
      )
      if (!response.ok) {
        logger.error('Unable to update experience', new Error(response.statusText))
        return false
      }

      const body = (await response.json()) as ApiResponse
      return body.success
    } catch (error) {
      logger.error('Unable to update experience', error)
      return false
    }
  }

  public async postRequest(experienceKey: string, sessionId: string, path: string, data: Record<string, string> = {}): Promise<boolean> {
    const url = getExperienceRequestUrl(this.xapiUrl, experienceKey, path, urlService.search)

    if (this.debug) {
      logger.log('Fake call to: POST' + url)
      return true
    }

    try {
      const response = await this.fetchService.fetch(
        url,
        {
          headers: this.getHeaders(sessionId),
          method: 'POST',
          body: JSON.stringify(data),
        },
        true,
      )
      if (!response.ok) {
        logger.error('Unable to update experience', new Error(response.statusText))
        return false
      }

      const body = (await response.json()) as ApiResponse
      return body.success
    } catch (error) {
      logger.error('Unable to update experience', error)
      return false
    }
  }

  public async logError(exception: Error, cause?: string): Promise<void> {
    const url = getErrorLogUrl(this.xapiUrl)
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        errorUrl: window.location.href,
        message: exception.message,
        cause,
      }),
      headers: this.getHeaders(),
    })
  }
}
