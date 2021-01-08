import { Component, h, Host, Prop, State } from '@stencil/core'
import { Experience } from '../../models'
import { onChange, state } from '../../services'
import { ExperienceDataParser } from '../../services/data/parser'

/**
 * This tag renders the values from the current experience to the page. It supports optional modifiers for formatting.
 * @requires {@link components.dxp-experience}
 * @export
 * @class Data
 */
@Component({
  tag: 'dxp-data',
  shadow: false,
})
export class Data {
  @State() experience?: Experience

  /**
   * The JS-based expression to capture data from the above model.
   * @example experience.data.color
   */
  @Prop() get!: string

  /**
   * A default value to display if the data in get is not found.
   */
  @Prop() default?: string

  /**
   * A pipe separated list of modifier expressions to modify the captured data.
   * clip: length
   *
   *  truncate: length
   *  date
   *  format: expression
   *  lowercase
   *  uppercase
   *  capitalize
   *  size
   *  encode
   *  currency
   *
   * @example clip:5|capitalize
   */
  @Prop() modify?: string

  private tokens!: ExperienceDataParser

  componentWillLoad() {
    if (state.experience) {
      this.experience = state.experience
      this.tokens = new ExperienceDataParser(state.experience)
    } else {
      onChange('experience', (e) => {
        this.experience = e
        this.tokens = new ExperienceDataParser(e)
      })
    }
  }

  render() {
    const value = this.tokens.getValue(this.get, this.modify)
    return <Host>{value || this.default}</Host>
  }
}
