import { hasToken, resolveTokens } from '../data/tokens'

export async function fetchContent(
  win: Window,
  src: string,
  mode: RequestMode,
) {
  // const cachedResult = contentState.cache[src]
  // if (cachedResult) return cachedResult
  const response = await win.fetch(src, {
    mode,
  })
  if (response.status == 200 || response.ok) {
    const content = await response.text()
    if (content) return content // (contentState.cache[src] = content)
    return null
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
  const resolvedSrc = await resolveSrc(src)
  const data = await fetchContent(win, resolvedSrc, mode)
  return data && tokens ? await resolveTokens(data) : data
}

export async function resolveSrc(src: string) {
  return hasToken(src) ? await resolveTokens(src) : src
}
