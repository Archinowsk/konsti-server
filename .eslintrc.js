module.exports = {
  extends: [
    'standard',
    'plugin:flowtype/recommended',
    'prettier',
    'prettier/flowtype',
    'prettier/standard',
  ],
  plugins: ['flowtype', /*'flowtype-errors',*/ 'prettier', 'standard'],
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
