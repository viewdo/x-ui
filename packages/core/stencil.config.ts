import { Config } from '@stencil/core'
import { JsonDocs } from '@stencil/core/internal/stencil-public-docs'
import fs from 'fs'
import analyzer from 'rollup-plugin-analyzer'
import { version } from './package.json'

const config: Config = {
  namespace: 'x-ui',
  excludeUnusedDependencies: true,
  preamble: '',
  hashFileNames: false,
  rollupPlugins: {
    after: [
      analyzer({
        summaryOnly: true,
      }),
    ],
  },
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
      footer: 'view.DO Experience Components',
      dependencies: false,
    },
    {
      type: 'docs-vscode',
      file: 'dist/custom-elements/custom-elements.json',
    },
    {
      type: 'docs-custom',
      generator: (docs: JsonDocs) => {
        Object.assign(docs, { version })
        docs.components.forEach(comp => {
          if (comp.readmePath) {
            let fileContents = fs.readFileSync(
              comp.readmePath,
              'utf8',
            )
            fileContents = fileContents.replace(
              /\s*\\\|\s*/gi,
              '` or `',
            )
            //fileContents = fileContents.split('"').join(`'`)
            fs.writeFileSync(
              comp.readmePath,
              fileContents.split('"').join(`'`),
            )
          }
        })
      },
    },
    {
      type: 'docs-json',
      file: 'dist/collection/components.json',
    },
  ],
}

export { config }
