import { newSpecPage } from '@stencil/core/testing';
import { EventEmitter, IEventEmitter, InterfaceActionListener, interfaceState, interfaceStateDispose } from '../../../services';
import { XUITheme } from '../x-ui-theme';

describe('x-ui-theme', () => {
  let actionListener: InterfaceActionListener
  let actionBus: IEventEmitter
  let eventBus: IEventEmitter
  beforeEach(() => {
    interfaceStateDispose()
    actionListener = new InterfaceActionListener()
    eventBus = new EventEmitter
    actionBus = new EventEmitter()
  })

  it('renders', async () => {

    const page = await newSpecPage({
      components: [XUITheme],
      html: `<x-ui-theme></x-ui-theme>`,
      autoApplyChanges: true
    });

    expect(page.root).toEqualHtml(`
      <x-ui-theme>
        <mock:shadow-root>
          <label class="switch" id="switch">
            <input aria-label="Change Theme" checked="" id="slider" type="checkbox">
            <span class="round slider"></span>
          </label>
        </mock:shadow-root>
      </x-ui-theme>
    `);

    const subject = page.body.querySelector('x-ui-theme')
    subject?.remove()
  })

  it('renders with dark preset', async () => {

    const page = await newSpecPage({
      components: [XUITheme]
    });

    actionListener.initialize(page.win, actionBus, eventBus)
    interfaceState.theme = 'dark'
    page.setContent(`<x-ui-theme></x-ui-theme>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-ui-theme>
        <mock:shadow-root>
          <label class="switch" id="switch">
            <input aria-label="Change Theme" id="slider" type="checkbox">
            <span class="round slider"></span>
          </label>
        </mock:shadow-root>
      </x-ui-theme>
    `);

    expect(page.body.classList.contains('dark')).toBe(true)

    const control = page.body.querySelector('x-ui-theme')
    const input =  control?.shadowRoot?.querySelector('input')
    input!.checked = true
    input!.dispatchEvent(new Event('change'));

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
     <x-ui-theme>
        <mock:shadow-root>
          <label class="switch" id="switch">
            <input aria-label="Change Theme" checked="" id="slider" type="checkbox">
            <span class="round slider"></span>
          </label>
        </mock:shadow-root>
      </x-ui-theme>
    `);

    const subject = page.body.querySelector('x-ui-theme')
    subject?.remove()
  });

  it('renders with dark media', async () => {
    const page = await newSpecPage({
      components: [XUITheme]
    });

    actionListener.initialize(page.win, actionBus, eventBus)

    let componentListener: any
    const mediaChanged = (_type: any, listener: any) => {
      componentListener = listener
    }

    const inner = page.win.matchMedia
    const replaced = (query: string) => {
      const results = inner(query);
      return {
        ...results,
        matches: true,
        addEventListener: mediaChanged
      }
    }

    page.win.matchMedia = replaced

    page.setContent(`<x-ui-theme></x-ui-theme>`)

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-ui-theme>
        <mock:shadow-root>
          <label class="switch" id="switch">
            <input aria-label="Change Theme" id="slider" type="checkbox">
            <span class="round slider"></span>
          </label>
        </mock:shadow-root>
      </x-ui-theme>
    `);

    expect(page.body.classList.contains('dark')).toBe(true)

    if (componentListener) {
      componentListener({
        matches: false
      })
    }

    await page.waitForChanges()

    expect(page.body.classList.contains('dark')).toBe(false)

    const subject = page.body.querySelector('x-ui-theme')
    subject?.remove()
  });



});
