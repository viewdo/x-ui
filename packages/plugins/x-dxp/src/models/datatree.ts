import { DataTreeItem } from './datatreeitem'

export class DataTree {
  /** These are the top level labels. Three labels means, three select lists and the items below must also have three sets. */

  public labels: string[] = []

  /** Should all of the lists be visible? Defaults to hiding until needed.  */
  public isStatic = false

  /**
   *  The data tree object of the cascading lists.  We should have a tree of values as deep as
   *  the label-count. This level is the options for the first label.
   */
  public items: DataTreeItem[] = []
}
