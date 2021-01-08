import { DataPoint } from './datapoint'
export class StoryInput extends DataPoint {
  public name: string
  public description?: string
  public source: string
  public required: boolean
  public key: string
}
