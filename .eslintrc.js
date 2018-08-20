module.exports = {
  extends: [
    'standard',
    'plugin:security/recommended',
    'plugin:flowtype/recommended',
    'prettier',
    'prettier/flowtype',
    'prettier/standard',
  ],
  plugins: [
    'flowtype',
    'prettier',
    'standard',
    'security',
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
    // 'flowtype-errors/show-errors': 'error',
  },
}
