const {splitMessage} = require('../src/helpers/utils');

test('Split message', () => {
  const message = '"Yay or Nay?" Yay Nay';
  const messageSplit = splitMessage(message);
  const expected = ['Yay or Nay?', 'Yay', 'Nay'];

  expect(messageSplit).toStrictEqual(expected);
});

test('Split message with all inside double quote', () => {
  const message = '"How much your average sleep time?" "5 hours" "6 hours" "7 hours" "8 hours" "9 hours"';
  const messageSplit = splitMessage(message);
  const expected = ['How much your average sleep time?', '5 hours', '6 hours', '7 hours', '8 hours', '9 hours'];
  expect(messageSplit).toStrictEqual(expected);

  const topic = messageSplit[0];
  messageSplit.shift();
  const choices = messageSplit;
  expect(topic).toStrictEqual('How much your average sleep time?');
  expect(choices).toStrictEqual(['5 hours', '6 hours', '7 hours', '8 hours', '9 hours']);
});
