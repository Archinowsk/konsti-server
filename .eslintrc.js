module.exports = {
  extends: ['airbnb', 'plugin:react/recommended', 'prettier', 'prettier/react'],
  // parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2016,
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
    },
  },
  plugins: ['react', 'jsx-a11y', 'import', 'prettier'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'prettier/prettier': ['warn', { trailingComma: 'es5', singleQuote: true }],
    'no-console': 'off', // Disallow the use of console
    'linebreak-style': ['warn', 'windows'], // Enforce consistent linebreak style
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ], // Forbid the use of extraneous packages
    'no-unused-vars': 'warn', // Disallow Unused Variables
    'arrow-body-style': [
      'warn',
      'as-needed',
      { requireReturnForObjectLiteral: true },
    ], // Require braces in arrow function body
    'react/forbid-prop-types': 'off', // Forbid certain propTypes
  },
};
