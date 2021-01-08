export class UrlInfo {
  constructor(currentUrl: string) {
    const urlsParameters: Record<string, any> = {}
    const a = document.createElement('a')
    a.href = currentUrl

    const urlSearchArray = a.search?.slice(1).split('&') || []

    urlSearchArray.forEach((parameter) => {
      const pair = parameter.split('=')
      const key = decodeURI(pair[0])
      let value = decodeURI(pair[1])

      if (value.match(/^\d+$/)) {
        value = Number.parseInt(value, 10)
      } else if (value.match(/^\d+\.\d+$/)) {
        value = Number.parseFloat(value)
      }

      if (urlsParameters[key] === undefined) {
        urlsParameters[key] = value
      } else if (typeof value === 'string') {
        urlsParameters[key] = [urlsParameters[key], value]
      } else {
        urlsParameters[key].push(value)
      }
    })

    this.protocol = a.protocol
    this.hostname = a.hostname
    this.host = a.host
    this.port = a.port
    this.hash = a.hash?.slice(1)
    this.pathname = a.pathname
    this.search = a.search
    this.parameters = urlsParameters
  }

  protocol: string
  hostname: string
  host: string
  port: string
  hash: string
  pathname: string
  search: string
  parameters: Record<string, string>
}
