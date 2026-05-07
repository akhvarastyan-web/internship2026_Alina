module.exports = {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
        ],
      },
    ],
    'selector-class-pattern': null,
    'no-empty-source': null,
    'no-descending-specificity': null,
  },
};
