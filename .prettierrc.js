module.exports = {
  arrowParens: 'always',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  jsxSingleQuote: false,
  quoteProps: 'consistent',
  printWidth: 120,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  overrides: [
    {
      files: '.editorconfig',
      options: { parser: 'yaml' },
    },
    {
      files: 'LICENSE',
      options: { parser: 'markdown' },
    },
  ],
}
