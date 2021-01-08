module.exports = {
  extends: 'stylelint-config-sass-guidelines',
  defaultSeverity: 'warning',
  ignoreFiles: '**.ts',
  plugins: ['stylelint-scss'],
  rules: {
    'selector-max-id': 5,
    'declaration-no-important': true,
    'function-parentheses-space-inside': null,
    'max-nesting-depth': 5,
    'no-descending-specificity': null,
    'selector-class-pattern': [
      '(^(((?!(is|has|my))[a-z]+){4,20}(\\-[a-z]+){0,2})(\\_\\_[a-z]+(\\-[a-z]+){0,2})?(\\-\\-[a-z]+(\\-[a-z]+){0,2}){0,2}$)|(^(row|container)$)',
      {
        resolveNestedSelectors: true,
        message: 'Selector should match hyphenated BEM-syntax (http://getbem.com/). State-Classes should be modifiers. (selector-class-pattern)',
      },
    ],
    'declaration-block-no-duplicate-properties': true,
    'declaration-block-no-shorthand-property-overrides': true,
  },
};
