export class KeyNamePair {
  /**
   * The unique id for this item
   * @pattern ^[A-Za-z0-9-_]{1,30}$ */
  public key: string

  /** Friendly name */
  public name: string
}
