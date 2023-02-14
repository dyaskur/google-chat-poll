const {buildConfigurationForm} = require('../config-form');

test('build configuration form', () => {
  const dialog = buildConfigurationForm({
    topic: "Who is the most handsome AI?",
    choices: [],
  });
  console.log(JSON.stringify(dialog))
  const json = require('./json/configuration_form.json')
  expect(dialog).toStrictEqual(json);
});
