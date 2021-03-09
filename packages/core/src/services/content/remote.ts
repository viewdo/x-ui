import { hasToken, resolveTokens } from '../data/tokens'

const cache: Record<string, string> = {}

export async function fetchContent(
  win: Window,
  src: string,
  mode: RequestMode,
) {
  if (cache[src]) return cache[src]
  const response = await win.fetch(src, {
    mode,
  })
  if (response.status == 200 || response.ok) {
    return (cache[src] = await response.text())
  }
  throw new Error(
    `Request to ${src} was not successful: ${response.statusText}`,
  )
}

export async function getRemoteContent(
  win: Window,
  src: string,
  mode: RequestMode,
  tokens: boolean,
) {
  const resolvedSrc = hasToken(src) ? await resolveTokens(src) : src
  const data = await fetchContent(win, resolvedSrc, mode)
  return data && tokens ? await resolveTokens(data) : data
}

export async function resolveSrc(src: string) {
  return hasToken(src) ? await resolveTokens(src) : src
}
