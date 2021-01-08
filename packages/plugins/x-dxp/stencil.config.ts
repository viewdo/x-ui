import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'

export const config: Config = {
  namespace: 'x-dxp',
  testing: {},
  plugins: [sass()],
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
    },
    {
      type: 'docs-json',
      file: '../../../www/data/x-dxp-components.json',
    },
    {
      type: 'www',
      buildDir: 'x-dxp',
      serviceWorker: null, // Disable service workers
      copy: [
        {
          src: '**/*.md',
          dest: 'docs',
          keepDirStructure: true,
        },
      ],
    },
  ],
}
