import { ExperienceController } from '../services/experience-controller'
import { ExperienceInformation } from './experienceinformation'

export class Experience extends ExperienceInformation {
  constructor(private readonly controller: ExperienceController, experienceData: ExperienceInformation) {
    super(experienceData)
  }

  public async setData(key: string, value: string): Promise<void> {
    return this.controller.setData(this.key, key, value)
  }

  public async setMilestone(milestone: string): Promise<void> {
    return this.controller.setMilestone(this.key, milestone)
  }

  public async recordEvent(event: string): Promise<void> {
    return this.controller.recordEvent(this.key, event)
  }

  public async setComplete(): Promise<void> {
    return this.controller.setComplete(this.key)
  }

  public async setConverted(label?: string): Promise<void> {
    return this.controller.setConverted(this.key, label)
  }

  public async setChildEntity(ocid?: string): Promise<void> {
    return this.controller.setChildEntity(this.key, ocid)
  }

  public async repersonalize(contactData: Record<string, string>): Promise<boolean> {
    return this.controller.repersonalize(this.key, contactData)
  }
}
