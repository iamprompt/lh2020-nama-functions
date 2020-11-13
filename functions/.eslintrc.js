module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-empty-function': 0,
    'no-empty': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    'no-case-declarations': 0,
    'no-async-promise-executor': 0,
    '@typescript-eslint/no-explicit-any': 0,
  },
}
