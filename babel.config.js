module.exports = api => {
  api.cache.using(() => process.env.NODE_ENV)
  const presets = [
    [
      '@babel/preset-env',
      {
        modules: api.env('test') ? 'commonjs' : false,
        debug: false,
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-flow',
  ]

  const plugins = [
    [
      'babel-plugin-module-resolver',
      {
        root: ['./src'],
      },
    ],
  ]

  return {
    presets,
    plugins,
  }
}
