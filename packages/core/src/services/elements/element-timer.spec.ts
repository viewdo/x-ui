import { newSpecPage } from '@stencil/core/testing'
import { sleep } from '../utils/promise-utils'
import { ElementTimer } from './element-timer'

describe('element-timer:', () => {
  let subject: ElementTimer

  it('emits time', async () => {
    const page = await newSpecPage({
      components: [],
      html: `
      <div id="timer">
        <input type="text" x-percentage-to="value" />
      </div>
      `,
    })

    subject = new ElementTimer(page.body, 100, false)

    subject.emitTime(10)
    await page.waitForChanges()

    let input = page.body.querySelector('input')
    expect(input!.value).toBe('0.1')

    subject.emitTime(20)
    await page.waitForChanges()

    input = page.body.querySelector('input')
    expect(input!.value).toBe('0.2')
  })

  it('emits time then cleans up', async () => {
    const page = await newSpecPage({
      components: [],
      html: `
      <div id="timer">
        <input type="text" x-percentage-to="value" />
      </div>
      `,
    })

    subject = new ElementTimer(page.body, 3, false)
    subject.beginInternalTimer()

    await sleep(3500)

    let input = page.body.querySelector('input')
    expect(input!.value).toBe('1')

    await sleep(500)
    expect(input!.value).toBe('0')

    subject.destroy()
  })
})
