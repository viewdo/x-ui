import { Config } from '@stencil/core'
import { OutputTargetWww } from '@stencil/core/internal'
import { sass } from '@stencil/sass'

// Const scssVariables = 'src/scss/variables.scss';
const config: Config = {
  namespace: 'lib',
  plugins: [sass()],
  preamble: 'view.DO 2021',
  hashFileNames: true,
  devServer: {
    openBrowser: false,
    reloadStrategy: 'pageReload',
    port: 3002,
    root: '../../docs',
  },
  outputTargets: [],
}

const wwwOutput: OutputTargetWww = {
  type: 'www',
  dir: '../../docs',
  buildDir: 'js',
  empty: false,
  serviceWorker: null,
  indexHtml: 'index.html',
  copy: [
    {
      src: 'pages',
      dest: '.',
      keepDirStructure: true,
    },
  ],
}

if (!config.devMode) {
  wwwOutput.serviceWorker = {
    globPatterns: ['**/*.{js,css,json,html,md.png,svg}'],
    swSrc: 'src/sw.ts',
  }
}

config.outputTargets?.push(wwwOutput)

export { config }
