import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'

// Const scssVariables = 'src/scss/variables.scss';
const config: Config = {
  namespace: 'lib',
  plugins: [sass()],
  preamble: 'view.DO 2021',
  hashFileNames: false,
  devServer: {
    openBrowser: false,
    reloadStrategy: 'pageReload',
    port: 8110,
    root: '../../docs',
  },
  outputTargets: [],
}

const wwwOutput: any = {
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

// if (!config.devMode) {
//   wwwOutput.serviceWorker = {
//     globPatterns: ['**/*.{js,css,json,html,md,mdx,wav,ico,mp3}'],
//   }
// }

config.outputTargets?.push(wwwOutput)

export { config }
