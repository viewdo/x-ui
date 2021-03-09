jest.mock('../../../services/common/logging')
jest.mock('../../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import { contentStateDispose } from '../../../services/content/state'
import { ElementsActionListener } from '../../../services/elements/actions'
import { actionBus, eventBus } from '../../../services/events'
import { VisitStrategy } from '../../../services/navigation/interfaces'
import { XActionActivator } from '../../x-action-activator/x-action-activator'
import { XAction } from '../../x-action/x-action'
import { MockRequestAnimationFrameProvider } from './mocks/frame-provider'
import { MockRoute } from './mocks/route'
import { ViewDoService } from './service'
import { ElementTimer } from './timer'

describe('view-do', () => {
  let subject: ViewDoService
  let timer: ElementTimer
  const animationFrameProvider = new MockRequestAnimationFrameProvider()

  beforeEach(async () => {
    animationFrameProvider.reset()
  })

  afterEach(async () => {
    eventBus.removeAllListeners()
    actionBus.removeAllListeners()
    subject?.cleanup()
    contentStateDispose()
  })

  it('initializes with fake video', async () => {
    const page = await newSpecPage({
      components: [],
      html: `
      <div>
        <video id="video"></video>
        <input x-time-to="value"/>
      </div>
      `,
    })

    await page.waitForChanges()

    timer = new ElementTimer(animationFrameProvider, 60, 0)

    const video = page.body.querySelector(
      '#video',
    ) as HTMLVideoElement

    subject = new ViewDoService(
      page.body,
      timer,
      new MockRoute(),
      'fake',
      VisitStrategy.optional,
      actionBus,
      eventBus,
      'video#video',
      'timeupdate',
      'ended',
      3,
      false,
    )
    await subject.beginTimer()

    video.currentTime = 1
    video.dispatchEvent(new CustomEvent('timeupdate'))

    const input = page.body.querySelector('input')!
    expect(input.value).toBe('1')
  })

  it('initialized with element timer', async () => {
    const page = await newSpecPage({
      components: [],
      html: `
      <div id="timer">
        <input type="text" x-percentage-to="value" />
      </div>
      `,
    })

    timer = new ElementTimer(animationFrameProvider, 60, 0)

    subject = new ViewDoService(
      page.body,
      timer,
      new MockRoute(),
      'fake',
      VisitStrategy.optional,
      actionBus,
      eventBus,
      'video#video',
      'timeupdate',
      'ended',
      60,
      false,
    )

    await subject.beginTimer()

    animationFrameProvider.triggerNextAnimationFrame(20000)
    await page.waitForChanges()
    let input = page.body.querySelector('input')
    expect(input!.value).toBe('0.33')

    animationFrameProvider.triggerNextAnimationFrame(60000)
    await page.waitForChanges()
    expect(input!.value).toBe('1.00')
  })

  it('emits time then cleans up', async () => {
    const page = await newSpecPage({
      components: [],
      html: `
      <div id="timer">
        <p x-percentage-to></p>
      </div>
      `,
    })
    timer = new ElementTimer(animationFrameProvider, 60, 0)

    subject = new ViewDoService(
      page.body,
      timer,
      new MockRoute(),
      'fake',
      VisitStrategy.optional,
      actionBus,
      eventBus,
      'video#video',
      'timeupdate',
      'ended',
      60,
      false,
    )

    await subject.beginTimer()
    animationFrameProvider.triggerNextAnimationFrame(60000)
    let p = page.body.querySelector('p')
    expect(p?.innerText).toBe('100%')
  })

  it('captures x-next & x-back', async () => {
    const page = await newSpecPage({
      components: [],
      html: `
      <div>
        <input id=="name" required value="Walter" />
        <a x-next>Next</a>
        <a x-back>Back</a>
        <a x-link="/foo">Foo</a>
      </div>
      `,
    })
    timer = new ElementTimer(animationFrameProvider, 0, 0)

    const route = new MockRoute()

    const goToParentRoute = jest
      .spyOn(route, 'goToParentRoute')
      .mockImplementationOnce(() => {})

    const goBack = jest
      .spyOn(route, 'goBack')
      .mockImplementationOnce(() => {})

    let goRoute = ''
    const goToRoute = jest
      .spyOn(route, 'goToRoute')
      .mockImplementationOnce(url => {
        goRoute = url
      })

    subject = new ViewDoService(
      page.body,
      timer,
      route,
      'fake',
      VisitStrategy.optional,
      actionBus,
      eventBus,
    )

    page.body.querySelector<HTMLAnchorElement>('a[x-next]')!.click()

    expect(goToParentRoute).toBeCalled()

    page.body.querySelector<HTMLAnchorElement>('a[x-back]')!.click()

    expect(goBack).toBeCalled()

    page.body.querySelector<HTMLAnchorElement>('a[x-link]')!.click()

    expect(goToRoute).toBeCalledWith('/foo')

    expect(goRoute).toBe('/foo')
  })

  it('captures x-time-in,x-in-class, x-time-out, x-out-class', async () => {
    const listener = new ElementsActionListener()
    const page = await newSpecPage({
      components: [],
      html: `<div hidden
        x-in-time="1"
        x-in-class="fade-in"
        x-out-time="3"
        x-out-class="fade-out">
        Cool Thing
      </div>
      `,
      autoApplyChanges: true,
    })

    timer = new ElementTimer(animationFrameProvider, 10, 0)

    listener.initialize(page.win, actionBus, eventBus)

    subject = new ViewDoService(
      page.body,
      timer,
      new MockRoute(),
      'fake',
      VisitStrategy.optional,
      actionBus,
      eventBus,
    )
    await subject.beginTimer()

    animationFrameProvider.triggerNextAnimationFrame(1500)

    expect(timer.elapsed?.elapsed).toBe(1.5)

    expect(page.root).toEqualHtml(
      `<div class="fade-in"
          x-in-time="1"
          x-in-class="fade-in"
          x-out-time="3"
          x-out-class="fade-out">
          Cool Thing
      </div>
      `,
    )

    animationFrameProvider.triggerNextAnimationFrame(3500)

    expect(page.root).toEqualHtml(
      `<div class="fade-out"
          x-in-time="1"
          x-in-class="fade-in"
          x-out-time="3"
          x-out-class="fade-out">
          Cool Thing
      </div>
      `,
    )

    animationFrameProvider.triggerNextAnimationFrame(10500)

    expect(page.root).toEqualHtml(`<div hidden
        x-in-time="1"
        x-in-class="fade-in"
        x-out-time="3"
        x-out-class="fade-out">
        Cool Thing
      </div>
      `)

    listener.destroy()
  })

  it('processes timed actions', async () => {
    const listener = new ElementsActionListener()
    const page = await newSpecPage({
      components: [XActionActivator, XAction],
      html: `<div>
              <p hidden>Show me!</p>
              <x-action-activator activate="AtTime" time="1">
                <x-action topic="elements" command="remove-attribute"
                  data-selector="p"
                  data-attribute="hidden">
                </x-action>
              </x-action-activator>
            </div>
            `,
    })

    timer = new ElementTimer(animationFrameProvider, 10, 0)

    listener.initialize(page.win, actionBus, eventBus)

    subject = new ViewDoService(
      page.body,
      timer,
      new MockRoute(),
      'fake',
      VisitStrategy.optional,
      actionBus,
      eventBus,
    )
    await subject.beginTimer()

    animationFrameProvider.triggerNextAnimationFrame(1500)

    expect(timer.elapsed?.elapsed).toBe(1.5)

    await page.waitForChanges()

    expect(page.body.innerHTML).toEqualHtml(
      `<div>
        <p>Show me!</p>
        <x-action-activator activate="AtTime" time="1">
          <!---->
          <x-action topic="elements" command="remove-attribute"
            data-selector="p"
            data-attribute="hidden">
          </x-action>
        </x-action-activator>
       </div>
      `,
    )

    listener.destroy()
  })
})
