import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'

// Const scssVariables = 'src/scss/variables.scss';
export const config: Config = {
  namespace: 'x-ui',
  plugins: [sass()],
  bundles: [
    { components: ['x-ui', 'x-view', 'x-view-do', 'x-link'] },
    { components: ['x-audio-player', 'x-audio-music-load', 'x-audio-sound-load', 'x-audio-music-action', 'x-audio-sound-action'] },
  ],
  preamble: 'view.DO 2021',
  devServer: {
    openBrowser: false,
    reloadStrategy: 'pageReload',
    port: 3333,
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
    },
    {
      type: 'docs-json',
      file: 'dist/collection/components.json',
    },
    {
      type: 'docs-json',
      file: '../../www/data/x-components.json',
    },
    {
      type: 'www',
      dir: '../../www',
      buildDir: 'x-ui',
      empty: true,
      indexHtml: 'index.html',
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
    },
  ],
}
