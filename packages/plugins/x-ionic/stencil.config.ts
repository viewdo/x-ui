import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'

export const config: Config = {
  namespace: 'x-ionic',
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
      file: '../../../www/data/x-ionic-components.json',
    },
    {
      type: 'www',
      buildDir: 'x-ionic',
      serviceWorker: null, // Disable service workers
      copy: [{ src: '**/*.md' }],
    },
  ],
}
