module.exports = {
  'env': {
    'browser': true,
    'node': true,
    'es2021': true,
  },
  // 'extends': 'google',
    extends: ['google', 'plugin:@typescript-eslint/recommended'],

  'overrides': [],
  'plugins': [
    '@typescript-eslint',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
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
  },
};
