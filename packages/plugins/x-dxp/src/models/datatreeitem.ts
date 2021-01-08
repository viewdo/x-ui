export class DataTreeItem {
  /**
   * The data key for this segment of the composite input.
   * @pattern ^[A-Za-z0-9-_~]{1,30}$
   */
  public key: string

  /** The value of this element */
  public name: string

  public items: DataTreeItem[] = new Array<DataTreeItem>()
}
