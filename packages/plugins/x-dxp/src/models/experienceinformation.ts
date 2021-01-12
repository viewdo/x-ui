import { Organization, Story, User } from '.';
import { getLocalDate } from '../services/utils';

export class ExperienceInformation {
  constructor(experienceData: any) {
    Object.assign(this, experienceData)
    this.convertStrings()
  }

  public events!: string[]
  public key!: string
  public data!: Record<string, string | boolean | number | Date>

  public story!: Story
  public user?: User
  public organization!: Organization
  public sessionId!: string
  public url!: string
  public created!: Date
  public expireOn!: Date
  public batchKey?: string
  public anonymous!: boolean
  public workflowStopped!: boolean
  public progress!: string
  public milestone?: string
  public effectiveProgress!: string
  public effectiveProgressValue!: number
  public currentEpisodeKey?: string
  public campaignKey?: string
  public childEntityKey?: string
  public identity!: string
  public version!: number

  private convertStrings() {
    for (const prop in this.story.inputs) {
      if (this.story.inputs.hasOwnProperty(prop)) {
        const input = this.story.inputs[prop]
        if (typeof input === 'object' && input != null) {
          if (input.display === 'Date') {
            this.data[prop] = getLocalDate(this.data[prop].toString(), true)
          } else if (input.display === 'DateTime') {
            this.data[prop] = getLocalDate(this.data[prop].toString())
          } else if (input.type === 'Number') {
            this.data[prop] = Number.parseInt(this.data[prop].toString())
          } else if (input.type === 'Boolean') {
            this.data[prop] = this.data[prop].toString() == 'True'
          }
        }
      }
    }
  }
}
