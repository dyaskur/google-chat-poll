const {buildAddOptionForm} = require('../add-option-form');
const {addOptionToState} = require('../helpers/option');
const {dummyPoll} = require('./dummy');
const json = require('./json/add_option_form.json');

test('build add option form', () => {
  const dialog = buildAddOptionForm({
    topic: 'Who is the most handsome AI?',
  });
  const json = require('./json/add_option_form.json');
  expect(dialog).toStrictEqual(json);
});

test('add a new option to state', () => {
  // clone object
  const state = structuredClone(dummyPoll);
  addOptionToState('Unspecific Worm', state, 'Yaskur');
  expect(state.choices).toEqual([
    'Feather Duster Worm',
    'Christmas Tree Worm',
    'Coco Worm',
    'Bearded Fireworm',
    'Giant Tube Worm',
    'Unspecific Worm',
  ]);
  expect(state.choiceCreator).toStrictEqual({'5': 'Yaskur'});
});

