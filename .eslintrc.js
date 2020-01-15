module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017
  },
  plugins: [
    'node'
  ],
  extends: [
    'eslint:recommended',
    'plugin:node/recommended'
  ],
  env: {
    node: true
  },
  rules: {
  },
  overrides: [
    // mocha tests
    {
      files: [
        'node-tests/**/*.js'
      ],
      plugins: [
        'chai-expect',
        'mocha',
      ],
      env: {
        mocha: true
      },
    }
  ]
};
