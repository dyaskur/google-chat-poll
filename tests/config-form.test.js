const {buildConfigurationForm, buildOptionsFromMessage} = require('../src/config-form');

test('build configuration form', () => {
  const dialog = buildConfigurationForm({
    topic: 'Who is the most handsome AI?',
    choices: [],
  });
  const json = require('./json/configuration_form.json');
  expect(dialog).toStrictEqual(json);
});

test('build options  from message', () => {
  const message = '"How much your average sleep time?" "5 hours" "6 hours" "7 hours" "8 hours" "9 hours"';
  const options = buildOptionsFromMessage(message);
  const expected = {
    topic: 'How much your average sleep time?',
    choices: ['5 hours', '6 hours', '7 hours', '8 hours', '9 hours'],
  };
  expect(options).toStrictEqual(expected);
});


test('build options from empty message', () => {
  const message = '';
  const options = buildOptionsFromMessage(message);
  const expected = {
    topic: '',
    choices: [],
  };
  expect(options).toStrictEqual(expected);
});

test('build options from undefined message', () => {
  const options = buildOptionsFromMessage(undefined);
  const expected = {
    topic: '',
    choices: [],
  };
  expect(options).toStrictEqual(expected);
});
