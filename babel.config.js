module.exports = api => {
  api.cache.using(() => process.env.NODE_ENV);
  const presets = [
    [
      '@babel/preset-env',
      {
        modules: 'commonjs',
        debug: false,
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-flow',
  ];

  const plugins = [
    [
      'babel-plugin-module-resolver',
      {
        root: ['./src'],
      },
      'babel-plugin-lodash',
    ],
  ];

  return {
    presets,
    plugins,
  };
};
