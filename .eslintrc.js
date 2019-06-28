module.exports = {
  extends: [
    'standard',
    'plugin:jest/recommended',
    'plugin:flowtype/recommended',
    // 'plugin:security/recommended',
    // 'plugin:unicorn/recommended',
    'plugin:node/recommended',
    'plugin:promise/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:eslint-plugin/recommended',
    'prettier',
    'prettier/flowtype',
    'prettier/standard',
  ],

  plugins: [
    'flowtype',
    'prettier',
    'standard',
    'security',
    'node',
    'promise',
    'unicorn',
    'eslint-plugin',
    'jest',
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
    // eslint-plugin-prettier
    'prettier/prettier': 'error',

    // eslint-plugin-node
    'node/no-unsupported-features/es-syntax': 'off', // Import and export declarations are not supported yet
    'no-process-exit': 'off', // There are valid uses for process.exit()

    // eslint-plugin-import
    'import/no-unused-modules': ['error', { unusedExports: true }],
  },
}
