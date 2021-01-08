import { EventEmitter } from '@stencil/core'
import { StoryInput } from './storyinput'

export class DataInput {
  constructor(private readonly input: StoryInput, value: any, private readonly dataChanged: EventEmitter<{ key: string; value: any }>) {
    this.internalValue = value || input.value
  }

  private internalValue: string | undefined

  get value(): string | number | boolean | Date | null {
    if (!this.internalValue) return null

    if (this.input.display === 'Date') {
      return this.getLocalDate(this.internalValue.toString(), true)
    }

    if (this.input.display === 'DateTime') {
      return this.getLocalDate(this.internalValue.toString())
    }

    return null
  }

  set value(value: string | number | boolean | Date | null) {
    if (this.internalValue === value?.toString()) {
      return
    }

    this.internalValue = value?.toString()
    this.dataChanged.emit({ key: this.input.key, value: this.coerceType(value) })
  }

  private getLocalDate(utcDateString: string, justDate = false): string {
    const milliseconds = Date.parse(utcDateString)
    const offset = new Date().getTimezoneOffset() * 60 * 1000
    if (!Number.isNaN(milliseconds)) {
      const serverDate = new Date(milliseconds)
      const localDate = new Date(serverDate.getTime() - offset)

      if (justDate) {
        return localDate.toISOString().slice(0, 10)
      }

      return localDate.toISOString().replace('Z', '')
    }

    return ''
  }

  private coerceType(value: any): string | boolean | number | Date {
    switch (this.input.type) {
      case 'Boolean':
        return value.toString() === 'true' || value.toString() === '1'
      case 'Number':
        return Number.parseFloat(value.toString())
      case 'Date':
      case 'DateTime':
        return new Date(value.toString())
      default:
        return value
    }
  }
}
