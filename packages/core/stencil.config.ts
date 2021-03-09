import { Config } from '@stencil/core'
import analyzer from 'rollup-plugin-analyzer'
import { version } from './package.json'

const config: Config = {
  namespace: 'x-ui',
  excludeUnusedDependencies: true,
  hashFileNames: false,
  rollupPlugins: {
    before: [
      analyzer({
        summaryOnly: true,
      }),
    ],
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: 'loader',
      empty: true,
    },
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
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'docs-readme',
      footer: 'view.DO Experience Components',
      dependencies: false,
    },
    {
      type: 'docs-vscode',
      file: 'dist/custom-elements/custom-elements.json',
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
  ],
}

if (config.buildDist) {
  config.rollupPlugins!.after = []
}

export { config }
