module.exports = {
  root: true,

  parser: '@typescript-eslint/parser', // or 'babel-eslint'

  extends: [
    'eslint-config-standard-with-typescript',
    'eslint-config-prettier',
    'eslint-config-prettier/standard',
    'eslint-config-prettier/@typescript-eslint',
    'plugin:eslint-plugin-eslint-comments/recommended',
    'plugin:eslint-plugin-jest/recommended',
    'plugin:eslint-plugin-node/recommended',
    'plugin:eslint-plugin-promise/recommended',
    'plugin:eslint-plugin-import/errors',
    // 'plugin:eslint-plugin-security/recommended',
    // 'plugin:eslint-plugin-unicorn/recommended',
  ],

  plugins: [
    'eslint-plugin-jest',
    'eslint-plugin-node',
    'eslint-plugin-prettier',
    'eslint-plugin-promise',
    'eslint-plugin-standard',
    'eslint-plugin-import',
    '@typescript-eslint',
    // 'eslint-plugin-security',
    // 'eslint-plugin-unicorn',
  ],

  ignorePatterns: ['lib', 'coverage', 'front'],

  parserOptions: {
    sourceType: 'module',
    impliedStrict: true,
    project: './tsconfig.json',
  },

  env: {
    node: true,
    jest: true,
  },

  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },

  rules: {
    // eslint
    'no-param-reassign': 'error',

    // eslint-plugin-prettier
    'prettier/prettier': 'error',

    // eslint-plugin-node
    'node/no-unsupported-features/es-syntax': 'off', // Import and export declarations are not supported yet
    'node/no-missing-import': 'off', // Not working with babel-plugin-module-resolver and handled by eslint-plugin-import

    // eslint-plugin-import
    'import/no-unused-modules': ['error', { unusedExports: true }],

    // eslint-plugin-eslint-comments
    'eslint-comments/no-unused-disable': 'error',

    // @typescript-eslint
    // TODO: Enable these
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/promise-function-async': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
  },
};
