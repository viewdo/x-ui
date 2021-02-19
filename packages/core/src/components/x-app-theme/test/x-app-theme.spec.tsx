import { newSpecPage } from '@stencil/core/testing';
import { interfaceState, interfaceStateDispose } from '../../../services';
import { XAppTheme } from '../x-app-theme';

describe('x-app-theme', () => {

  beforeEach(() => {
    interfaceStateDispose()
  })

  it('renders with light preset', async () => {

    const page = await newSpecPage({
      components: [XAppTheme]
    });
    page.setContent(`<x-app-theme></x-app-theme>`)
    await page.waitForChanges();

    expect(page.body.classList.contains('dark')).toBe(false)
    const subject = page.body.querySelector('x-app-theme')
    subject?.remove()
  });

  it('renders with dark preset', async () => {

    const page = await newSpecPage({
      components: [XAppTheme]
    });
    interfaceState.theme = 'dark'
    page.setContent(`<x-app-theme></x-app-theme>`)
    await page.waitForChanges();
    expect(page.body.classList.contains('dark')).toBe(true)
    const subject = page.body.querySelector('x-app-theme')
    subject?.remove()
  });

  it('renders with dark media', async () => {
    const page = await newSpecPage({
      components: [XAppTheme]
    });

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

    page.setContent(`<x-app-theme></x-app-theme>`)

    await page.waitForChanges()

    expect(page.body.classList.contains('dark')).toBe(true)

    if (componentListener) {
      componentListener({
        matches: false
      })
    }

    await page.waitForChanges()

    expect(page.body.classList.contains('dark')).toBe(false)
    const subject = page.body.querySelector('x-app-theme')
    subject?.remove()
  });

});
