import { hasToken, resolveTokens } from '../data'

export async function getRemoteContent(
  win: Window,
  src: string,
  mode: RequestMode,
  tokens: boolean,
) {
  const resolvedSrc = hasToken(src) ? await resolveTokens(src) : src
  const response = await win.fetch(resolvedSrc, {
    mode,
  })
  if (response.status == 200 || response.ok) {
    const data = await response.text()
    return data && tokens ? await resolveTokens(data) : data
  }
  throw new Error(
    `Request to ${resolvedSrc} was not successful: ${response.statusText}`,
  )
}
