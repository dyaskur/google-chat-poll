module.exports = {
  'env': {
    'browser': true,
    'node': true,
    'es2021': true,
  },
  'extends': ['google', 'plugin:@typescript-eslint/recommended'],

  'overrides': [],
  'plugins': [
    '@typescript-eslint',
  ],
  'parserOptions': {
    'parser': '@typescript-eslint/parser',
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'rules': {
    'max-len': [
      'error',
      {'code': 120, 'ignoreTemplateLiterals': true, 'ignoreStrings': true}],
    'valid-jsdoc': [
      2, {
        'prefer': {'return': 'returns'},
      }],
    'require-jsdoc': 0,
    '@typescript-eslint/ban-ts-comment': [
      'error', {'ts-ignore': 'allow-with-description'},
    ],
    'indent': [
      'error',
      2,
      {
        'SwitchCase': 1,
      },
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'quotes': [
      'error',
      'single',
    ],
  },
};
