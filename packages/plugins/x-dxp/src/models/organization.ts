export class Organization {
  public key: string
  public name: string
  public childEntityType?: string
  public entities: any[] = []
  public dataPoints?: any
  public data: Record<string, string | number | Date | boolean> = {}
  public logoUrl: string
}
