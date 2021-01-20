jest.mock('../../../services/logging')
jest.mock('../../../services/logging')

import { newSpecPage } from '@stencil/core/testing'
import { XActionActivator } from '../x-action-activator'
import { XAction } from '../../x-action/x-action'
import { actionBus, eventBus } from '../../../services'
import { sleep } from '../../../services/utils/promise-utils'

describe('x-action-activator', () => {
  beforeAll(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XActionActivator],
      html: `<x-action-activator></x-action-activator>`,
    })
    expect(page.root).toEqualHtml(
      `<x-action-activator>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </x-action-activator>`,
    )
  })

  it('captures child actions', async () => {
    const page = await newSpecPage({
      components: [XActionActivator, XAction],
      html: `<x-action-activator activate="OnEnter">
               <x-action topic="test" command="pass"></x-action
             </x-action-activator>`,
    })

    const activator = page.body.querySelector('x-action-activator')
    expect(activator).toBeDefined()

    let command = null
    actionBus.on('test', (e) => {
      command = e.command
    })

    await activator?.activateActions()

    expect(command).toBe('pass')
  })

  it('captures child element event', async () => {
    const page = await newSpecPage({
      components: [XActionActivator, XAction],
      html: `<x-action-activator activate="OnElementEvent" target-element="button" target-event="click" >
               <button type="button">Click Me</button>
               <x-action topic="test" command="pass"></x-action>
             </x-action-activator>`,
    })

    await page.waitForChanges()

    const activator = page.body.querySelector('x-action-activator')
    expect(activator).toBeDefined()

    const button = page.body.querySelector('button')

    let command = null
    actionBus.on('test', (e) => {
      command = e.command
    })

    button?.click()

    await sleep(100)

    expect(command).toBe('pass')

    button?.click()
  })

  it('captures child element event no selector', async () => {
    const page = await newSpecPage({
      components: [XActionActivator, XAction],
      html: `<x-action-activator activate="OnElementEvent" >
               <a>Click Me </a>
               <x-action topic="test" command="pass"></x-action>
             </x-action-activator>`,
    })

    await page.waitForChanges()

    const activator = page.body.querySelector('x-action-activator')
    expect(activator).toBeDefined()

    const link = page.body.querySelector('a')

    let command = null
    actionBus.on('test', (e) => {
      command = e.command
    })

    link?.click()

    await sleep(100)

    expect(command).toBe('pass')
  })

  it('x-action: get data', async () => {
    const page = await newSpecPage({
      components: [XAction],
      html: `<x-action></x-action>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(
      `<x-action hidden="">
       </x-action>`,
    )

    const action = page.body.querySelector('x-action')

    expect(action).not.toBeNull()

    const event = action?.getAction()

    expect(event).not.toBeNull()
  })

  it('x-action: get data from script', async () => {
    const page = await newSpecPage({
      components: [XAction],
      html: `<x-action topic="test" command="feed-me">
              <script>{ "name": "willy" }</script>
             </x-action>`,
      supportsShadowDom: false,
    })
    expect(page.root).toEqualHtml(
      `<x-action hidden="" topic="test" command="feed-me">
        <script>{ "name": "willy" }</script>
       </x-action>`,
    )

    const action = page.body.querySelector('x-action')

    expect(action).not.toBeNull()

    const event = await action?.getAction()

    expect(event).not.toBeNull()

    expect(event?.topic).toBe('test')
    expect(event?.command).toBe('feed-me')
    expect(event?.data.name).toBe('willy')
  })
})
