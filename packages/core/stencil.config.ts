import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'
import { version } from './package.json'

// Const scssVariables = 'src/scss/variables.scss';
const config: Config = {
  namespace: 'x-ui',
  plugins: [sass()],
  preamble: 'view.DO 2021',
  hashFileNames: false,
  devServer: {
    openBrowser: false,
    reloadStrategy: 'pageReload',
    port: 3333,
  },
  outputTargets: [
    {
      type: 'docs-vscode',
      file: './dist/custom-elements/custom-elements.json',
    },
    {
      type: 'dist',
      esmLoaderPath: 'loader',
      empty: true,
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'docs-readme',
      footer: 'view.DO : Experience Platform',
    },
    {
      type: 'docs-custom',
      generator: (docs: any) => {
        docs = Object.assign(docs, { version })
      },
    },
    {
      type: 'docs-json',
      file: 'dist/collection/components.json',
    },
    {
      type: 'docs-json',
      file: '../../www/data/x-components.json',
    },
  ],
}

const wwwOutput = {
  type: 'www',
  dir: '../../www',
  buildDir: 'x-ui',
  empty: true,
  serviceWorker: {
    globPatterns: ['**/*.{js,css,json,html,md,mdx,wav,ico,mp3}'],
  },
  copy: [
    { src: 'docs', dest: './', keepDirStructure: true },
    {
      src: 'docs/*.html',
      dest: './',
    },
    {
      src: 'components/**/*.{md,html}',
      dest: 'docs',
      keepDirStructure: true,
    },
    {
      src: 'services/**/*.{md,html}',
      dest: 'docs',
      keepDirStructure: true,
    },
  ],
}

if (config.devMode) {
  wwwOutput.serviceWorker = null
}

config.outputTargets?.push(wwwOutput)

export { config }
