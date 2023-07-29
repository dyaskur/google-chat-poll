module.exports = {
  'env': {
    'browser': true,
    'node': true,
    'es2021': true,
  },
  'extends': 'google',
  'overrides': [],
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
