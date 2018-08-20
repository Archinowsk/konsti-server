module.exports = {
  extends: [
    'standard',
    // 'plugin:security/recommended',
    'plugin:flowtype/recommended',
    // 'plugin:node/recommended',
    // 'plugin:promise/recommended',
    // 'plugin:unicorn/recommended',
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
    // 'flowtype-errors',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    impliedStrict: true,
  },
  env: {
    node: true,
  },
  rules: {
    'prettier/prettier': 'error',
    'node/no-unsupported-features/es-syntax': 'off',
    // 'flowtype-errors/show-errors': 'error',
  },
}
