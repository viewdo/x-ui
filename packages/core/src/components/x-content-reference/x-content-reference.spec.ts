jest.mock('../../services/data/evaluate.worker')

import { newSpecPage } from '@stencil/core/testing'
import {
  elementsStateReset,
  hasReference,
} from '../../services/elements'
import { XContentReference } from './x-content-reference'

jest.setTimeout(1000)

describe('x-content-reference', () => {
  afterEach(() => {
    elementsStateReset()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [XContentReference],
      html: `<x-content-reference inline defer-load></x-content-reference>`,
    })
    expect(page.root).toEqualHtml(`
      <x-content-reference inline defer-load>
      </x-content-reference>
    `)
  })

  it('renders inline script', async () => {
    const page = await newSpecPage({
      components: [XContentReference],
      html: `<x-content-reference script-src="https://foo.js" inline></x-content-reference>`,
    })
    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <x-content-reference script-src="https://foo.js" inline><script src="https://foo.js"></script>
      </x-content-reference>
    `)

    expect(hasReference('https://foo.js')).toBeTruthy()
  })

  it('renders inline styles', async () => {
    const page = await newSpecPage({
      components: [XContentReference],
      html: `<x-content-reference style-src="https://foo.css" inline></x-content-reference>`,
    })

    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <x-content-reference style-src="https://foo.css" inline><link href="https://foo.css" rel="stylesheet"/>
      </x-content-reference>
    `)

    expect(hasReference('https://foo.css')).toBeTruthy()
  })

  it('renders module scripts', async () => {
    const page = await newSpecPage({
      components: [XContentReference],
      html: `
       <x-content-reference inline module script-src="https://foo.jsm"></x-content-reference>
      `,
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-reference inline="" module="" script-src="https://foo.jsm">
        <script type="module" src="https://foo.jsm"></script>
      </x-content-reference>
    `)

    expect(hasReference('https://foo.jsm')).toBeTruthy()
  })

  it('renders no-module scripts', async () => {
    const page = await newSpecPage({
      components: [XContentReference],
      html: `
       <x-content-reference inline no-module script-src="https://foo.jsm"></x-content-reference>
      `,
    })
    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <x-content-reference inline="" no-module="" script-src="https://foo.jsm">
        <script nomodule="" src="https://foo.jsm"></script>
      </x-content-reference>
    `)

    expect(hasReference('https://foo.jsm')).toBeTruthy()
  })

  it('prevents duplicates styles', async () => {
    const page = await newSpecPage({
      components: [XContentReference],
      html: `
      <x-content-reference style-src="https://foo.css" inline></x-content-reference>
      <x-content-reference style-src="https://foo.css" inline></x-content-reference>`,
    })
    await page.waitForChanges()
    expect(page.root).toEqualHtml(`
      <x-content-reference style-src="https://foo.css" inline="">
        <link href="https://foo.css" rel="stylesheet">
      </x-content-reference>
    `)

    expect(hasReference('https://foo.css')).toBeTruthy()
  })
})
