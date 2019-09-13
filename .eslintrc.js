module.exports = {
  extends: [
    'eslint-config-standard',
    'eslint-config-prettier',
    'eslint-config-prettier/flowtype',
    'eslint-config-prettier/standard',
    'plugin:eslint-plugin-eslint-comments/recommended',
    'plugin:eslint-plugin-flowtype/recommended',
    'plugin:eslint-plugin-jest/recommended',
    'plugin:eslint-plugin-node/recommended',
    'plugin:eslint-plugin-promise/recommended',
    // 'plugin:eslint-plugin-security/recommended',
    // 'plugin:eslint-plugin-unicorn/recommended',
  ],

  plugins: [
    'eslint-plugin-flowtype',
    'eslint-plugin-jest',
    'eslint-plugin-node',
    'eslint-plugin-prettier',
    'eslint-plugin-promise',
    'eslint-plugin-standard',
    // 'eslint-plugin-security',
    // 'eslint-plugin-unicorn',
  ],

  parser: 'babel-eslint',

  parserOptions: {
    sourceType: 'module',
    impliedStrict: true,
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
    'no-unused-expressions': 'off', // False warnings with Flow
    'no-param-reassign': 'error',
    'no-process-exit': 'off', // There are valid uses for process.exit()

    // eslint-plugin-flowtype
    'flowtype/no-unused-expressions': 'error', // Fixed version of no-unused-expressions

    // eslint-plugin-prettier
    'prettier/prettier': 'error',

    // eslint-plugin-node
    'node/no-unsupported-features/es-syntax': 'off', // Import and export declarations are not supported yet
    'node/no-missing-import': 'off', // Bugging with eslint-plugin-module-resolver and handled by flow

    // eslint-plugin-import
    // Useful but disabled because slows down ESLint
    // 'import/no-unused-modules': ['error', { unusedExports: true }],

    // eslint-plugin-eslint-comments
    'eslint-comments/no-unused-disable': 'error',
  },
}
