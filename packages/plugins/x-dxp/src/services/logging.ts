export class LoggingService {
  private get prefix() {
    return '%cview.DO X-Host%c '
  }

  private readonly colors = {
    log: ['color: white;background:#7566A0;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 5px', 'color: black:background:none;font-weight:normal'],
    debug: ['color: white;background:#44883E;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 5px', 'color: black:background:none;font-weight:normal'],
    warn: [
      'color: white;background:#ffc409;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 5px',
      'color: black:background:none;font-weight:normal;color:#FDD757;',
    ],
    error: ['color: white;background:#eb445a;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 5px', 'color: black:background:none;font-weight:normal;color:red;'],
  }

  public log(message: string) {
    console.log(this.prefix + message, ...this.colors.log)
  }

  public debug(message: string) {
    console.debug(this.prefix + message, ...this.colors.debug)
  }

  public warn(warning: string) {
    console.warn(this.prefix + warning, ...this.colors.warn)
  }

  public async error(message: string, exception: Error) {
    console.error(message, exception)
  }

  public dir(data: any) {
    console.log(this.prefix + 'data:')
    console.dir(data)
  }
}
