import { DataTree } from './datatree'
import { DataType } from './datatype'
import { DisplayType } from './displaytype'
import { OptionItem } from './optionitem'

export class DataPoint {
  constructor(dataPoint: any) {
    Object.assign(this, dataPoint)
  }

  /**
   * The input key.
   * @pattern ^[A-Za-z0-9-_]{1,30}$
   */
  public key: string

  /**
   * The input name (shown on DXP forms)
   */
  public name: string

  /**
   * The display-type when presenting this input on a page
   */
  public display: DisplayType

  /** @ignore */
  public type: DataType

  /**
   * The tooltip to display when presenting on a form.
   * @nullable
   */
  public tip?: string

  /**
   * The description to show along with the name when presenting this on a form.
   */
  public description?: string

  /** @ignore */
  public order: number

  /**
   * Mark this true to force this value be set when creating an experience.
   */
  public required = false

  /**
   * If the display-type is Options, these are the list of values the user will select from.
   */
  public options?: OptionItem[]

  /**
   * An object that describes a set of cascading options.
   * @nullable
   */
  public dataTree?: DataTree

  /**
   * An whose name and values are assigned to the underlying HTML input.
   *
   */
  public attributes?: Record<string, string>

  /**
   * This is the default value if no other value is input.
   *
   */
  public value?: string | boolean | number
}
