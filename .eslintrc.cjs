/* eslint-disable @typescript-eslint/no-var-requires */
const packageJson = require('./package.json');

module.exports = {
  extends: [require.resolve('js2me-eslint-config/react')],
  rules: {
    'import/no-unresolved': [
      'error',
      { ignore: Object.keys(packageJson.peerDependencies) },
    ],
    'unicorn/prevent-abbreviations': 'off'
  },
  overrides: [
    {
      files: [
        "*.test.ts",
      ],
      parserOptions: {
        project: 'tsconfig.test.json',
      },
    }
  ]
};
