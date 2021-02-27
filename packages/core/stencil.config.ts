import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'
import { version } from './package.json'

const config: Config = {
  namespace: 'x-ui',
  plugins: [sass()],
  preamble: 'view.DO 2021',
  enableCacheStats: true,
  enableCache: true,
  excludeUnusedDependencies: true,
  hashFileNames: true,
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
      empty: true,
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'docs-readme',
      footer: 'view.DO : Experience Platform',
      dependencies: false,
    },
    {
      type: 'docs-vscode',
      file: 'dist/custom-elements/custom-elements.json',

      sourceCodeBaseUrl: '/home/jason/dvcs/github.com/viewdo/x-ui/packages/core',
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
      file: '../../docs/json/components.json',
    },
    {
      type: 'www',
      dir: '../../docs',
      buildDir: 'dist',
      empty: true,
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
    },
  ],
}

export { config }
