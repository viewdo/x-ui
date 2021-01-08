import { Namespace } from '../../models/namespace'
import { requireValue } from '../utils'

export const PreviewExperienceKey = '$example'

export function getXAPIUrlFromNamespace(namespace: Namespace): string {
  return `https://dxp-xapi.${namespace}.viewdo.run/v4`
}

export function getPreviewExperienceUrl(xapiUrl: string, storyKey: string, userKey: string, search: string): string {
  requireValue(xapiUrl, 'xapiUrl')
  requireValue(storyKey, 'storyKey')

  if (userKey) {
    return `${xapiUrl}/experience/preview/${encodeURIComponent(storyKey)}/${encodeURIComponent(userKey)}${search || ''}`
  }

  return `${xapiUrl}/experience/preview/${encodeURIComponent(storyKey)}${search}`
}

export function getFunnelExperienceUrl(xapiUrl: string, storyKey: string, userKey: string, search: string): string {
  requireValue(xapiUrl, 'xapiUrl')

  if (storyKey && userKey) {
    return `${xapiUrl}/experience/a/${encodeURIComponent(storyKey)}/${encodeURIComponent(userKey)}${search || ''}`
  }

  if (storyKey) {
    return `${xapiUrl}/experience/a/${encodeURIComponent(storyKey)}${search || ''}`
  }

  return `${xapiUrl}/experience/a/${search}`
}

export function getExperienceRequestUrl(xapiUrl: string, experienceKey: string, segment: string, search: string): string {
  requireValue(xapiUrl, 'xapiUrl')
  requireValue(experienceKey, 'experienceKey')
  requireValue(segment, 'segment')

  return `${xapiUrl}/experience/${encodeURIComponent(experienceKey)}/${segment}${search || ''}`
}

export function getExperienceCSSUrl(xapiUrl: string, experienceKey: string, storyKey: string, eid: string): string {
  requireValue(xapiUrl, 'xapiUrl')
  requireValue(experienceKey, 'experienceKey')
  requireValue(storyKey, 'storyKey')
  const segment = experienceKey && experienceKey !== '$example' ? `/experience/${experienceKey}` : `/story/${storyKey}`

  const suffix = eid ? `?eid=${eid}` : ''

  return `${xapiUrl}${segment}.css${suffix || ''}`
}

export function getExperienceScriptUrl(xapiUrl: string, storyKey: string, eid: string): string {
  requireValue(xapiUrl, 'xapiUrl')
  requireValue(storyKey, 'storyKey')

  const suffix = eid ? `?eid=${eid}` : ''

  return `${xapiUrl}/story/${storyKey}.js${suffix || ''}`
}

export function getErrorLogUrl(xapiUrl: string): string {
  return `${xapiUrl}/experience/logerror`
}
