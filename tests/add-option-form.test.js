const {buildAddOptionForm} = require('../src/add-option-form');
const {addOptionToState} = require('../src/helpers/option');
const {dummyPoll} = require('./dummy');
const json = require('./json/add_option_form.json');

test('build add option form', () => {
  const dialog = buildAddOptionForm({
    topic: 'Who is the most handsome AI?',
  });
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
  addOptionToState('Another Unspecific Worm', state, 'Dyas');
  expect(state.choices).toEqual([
    'Feather Duster Worm',
    'Christmas Tree Worm',
    'Coco Worm',
    'Bearded Fireworm',
    'Giant Tube Worm',
    'Unspecific Worm',
    'Another Unspecific Worm',
  ]);
  expect(state.choiceCreator).toStrictEqual({'5': 'Yaskur', '6': 'Dyas'});
});

