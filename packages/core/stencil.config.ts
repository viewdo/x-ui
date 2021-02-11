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
    root: '../../docs',
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: 'loader',
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'docs-readme',
      footer: 'view.DO : Experience Platform',
    },
    {
      type: 'docs-vscode',
      file: './dist/custom-elements/custom-elements.json',
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
      file: '../../docs/data/components.json',
    },
  ],
}

const wwwOutput: any = {
  type: 'www',
  dir: '../../docs',
  buildDir: 'dist',
  empty: false,
  serviceWorker: null,
  indexHtml: 'index.html',
  copy: [
    {
      src: 'components/**/*.{md,html}',
      dest: 'pages',
      keepDirStructure: true,
    },
    {
      src: 'services/**/*.{md,html}',
      dest: 'pages',
      keepDirStructure: true,
    },
  ],
}

if (!config.devMode) {
  wwwOutput.serviceWorker = {
    globPatterns: ['**/*.{js,css,json,html,md,mdx,wav,ico,mp3}'],
  }
}

config.outputTargets?.push(wwwOutput)

export { config }
