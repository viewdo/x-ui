import purgecss from '@fullhuman/postcss-purgecss'
import { Config } from '@stencil/core'
import { postcss } from '@stencil/postcss'
import { sass } from '@stencil/sass'
const config: Config = {
  plugins: [
    sass(),
    postcss({
      plugins: [
        purgecss({
          content: ['src/index.html', 'src/pages/**/*.html'],
        }),
      ],
    }),
  ],
  preamble: 'view.DO 2021',
  globalStyle: 'src/index.scss',
  globalScript: 'src/index.ts',
  devServer: {
    openBrowser: false,
    reloadStrategy: 'pageReload',
    port: 3002,
    gzip: true,
    root: '../../docs',
  },
  outputTargets: [
    {
      type: 'www',
      dir: '../../docs',
      buildDir: 'js/docs',
      empty: false,
      serviceWorker: {
        globPatterns: ['src/**/*.{js,css,json,html,md.png,svg}'],
        swSrc: 'src/sw.ts',
      },
      indexHtml: 'index.html',
      copy: [
        {
          src: 'pages',
          dest: '.',
          keepDirStructure: true,
        },
      ],
    },
  ],
}

export { config }
