module.exports = {
  env: {
    browser: true,
    es2024: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    project: './tsconfig.json',
    sourceType: 'module',
  },
  plugins: [
    'react',
    'jsx-a11y',
    'import',
    'react-hooks',
    '@typescript-eslint',
    'prettier',
  ],
  rules: {
    // JS & TS
    semi: 'off',
    '@typescript-eslint/semi': ['error', 'always'],
    'prefer-const': 2,
    curly: [2, 'all'],
    'max-len': [
      'error',
      {
        ignoreTemplateLiterals: true,
        ignoreComments: true,
      },
    ],
    'no-console': 1,
    'no-param-reassign': [2, { props: true }],
    'padding-line-between-statements': [
      2,
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
      { blankLine: 'always', prev: 'directive', next: '*' },
      { blankLine: 'always', prev: 'block-like', next: '*' },
    ],
    'implicit-arrow-linebreak': 0,

    // React
    'react/prop-types': 0,
    'react/require-default-props': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react-hooks/rules-of-hooks': 2,
    'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],

    // Typescript
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
    'vite.config.ts',
    'src/vite-env.d.ts',
    'cypress',
    'postcss.config.js',
    'tailwind.config.js',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
