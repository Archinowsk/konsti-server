module.exports = {
  presets: [
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
  ],
  plugins: [
    [
      'babel-plugin-module-resolver',
      {
        root: ['./src'],
      },
    ],
  ],
}