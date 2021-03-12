import { Config } from '@stencil/core'

const config: Config = {
  namespace: 'x-ui',
  hashFileNames: false,
  outputTargets: [
    {
      type: 'www',
      dir: '../../docs',
      buildDir: 'js/dist',
      empty: false,
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
        {
          src: '../dist/collection/components.json',
          dest: 'assets/components.json',
        },
      ],
    },
  ],
}

export { config }
