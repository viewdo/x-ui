import { Episode } from './episode';
import { ProgressMap } from './progressmap';
import { StoryEvent } from './storyevent';
import { StoryInput } from './storyinput';
import { Template } from './template';

export class Story {
  public key: string
  public name: string
  public description: string
  public storySchemaKey?: any
  public version: number
  public schemaVersion: number
  public inputs: StoryInput[]
  public milestones: string[]
  public htmlTemplates: Template[]
  public textTemplates: Template[]
  public events: string[]
  public storyEvents: StoryEvent[]
  public progressMap: ProgressMap
  public episodes: Episode[]
  public externalEvents: any[]
  public hasJsFile: boolean
  public hasJSONFile: boolean
  public hasCSSFile: boolean
  public hasDeliveryAction: boolean
  public persistent: boolean
  public data: any
  public thumbnailUrl: string
  public jsFile?: string
  public cssFile?: string
  public publicCreationEnabled: boolean
  public jsUrl: string
  public cssUrl: string
}
