import { Component, h, State, Prop, Element } from '@stencil/core'
import { Experience } from '../../models'
import { state, onChange } from '../../services'
import { ExperienceDataParser, Comparison } from '../../services/data/parser'

/**
 * This tag conditionally renders child elements based on the configured
 * predicate applied to the current experience data.
 *
 * @export
 * @class Show
 */
@Component({
  tag: 'dxp-show',
  shadow: false,
})
export class Show {
  @Element() element: HTMLDxpShowElement
  @State() experience: Experience

  /**
   * A JS-based expression to capture data from the the data model.
   * @example: experience.data.color
   */
  @Prop() if!: string

  /**
   * The optional comparison operator. If omitted, general ‘truthiness’ is used.
   * @requires to
   */
  @Prop() is: Comparison

  /**
   * The optional value for comparison.
   * @requires is
   */
  @Prop() to: any

  private tokens: ExperienceDataParser

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
    const show = this.tokens.getShow(this.if, this.is, this.to)

    this.element.style.display = show ? '' : 'none'
    return <slot></slot>
  }
}
