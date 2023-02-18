const {buildAddOptionForm} = require('../add-option-form');

test('build configuration form', () => {
  const dialog = buildAddOptionForm({
    topic: 'Who is the most handsome AI?',
  });
  const json = require('./json/add_option_form.json');
  expect(dialog).toStrictEqual(json);
});

test('build configuration form', () => {
  const dialog = buildAddOptionForm({
    topic: 'Who is the most handsome AI?',
  });
  const json = require('./json/add_option_form.json');
  expect(dialog).toStrictEqual(json);
});

