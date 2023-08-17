// @ts-ignore: unreasonable ts error
import {default as json} from './json/add_option_form.json';
import {addOptionToState} from '../src/helpers/option';
import {buildAddOptionForm} from '../src/add-option-form';

import {dummyPoll} from './dummy';

test('build add option form', () => {
  const dialog = buildAddOptionForm({
    topic: 'Who is the most handsome AI?',
    choices: [],
  });
  expect(dialog).toEqual(json);
});

test('add a new option to state', () => {
  // clone object
  const state = structuredClone(dummyPoll);
  addOptionToState('Unspecific Worm', state);
  expect(state.choices).toEqual([
    'Feather Duster Worm',
    'Christmas Tree Worm',
    'Coco Worm',
    'Bearded Fireworm',
    'Giant Tube Worm',
    'Unspecific Worm',
  ]);
  expect(state.choiceCreator).toStrictEqual({'5': ''});
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
  expect(state.choiceCreator).toStrictEqual({'5': '', '6': 'Dyas'});
});

