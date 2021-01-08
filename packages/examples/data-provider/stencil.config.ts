import { Config } from '@stencil/core'

export const config: Config = {
  namespace: 'sample-data-provider',
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
      type: 'www',
      serviceWorker: null, // Disable service workers
    },
  ],
}
