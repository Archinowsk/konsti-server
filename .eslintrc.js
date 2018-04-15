module.exports = {
  extends: ['standard', 'prettier', 'prettier/standard'],
  plugins: ['prettier', 'standard'],
  parserOptions: {
    sourceType: 'module',
    impliedStrict: true,
  },
  env: {
    node: true,
  },
  rules: {
    'prettier/prettier': 'error',
  },
}
