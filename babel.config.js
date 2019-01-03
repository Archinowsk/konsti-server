module.exports = api => {
  api.cache(true)

  const presets = [
    [
      '@babel/preset-env',
      {
        modules: false,
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
