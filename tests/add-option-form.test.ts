// @ts-ignore: unreasonable ts error
import {addOptionToState} from '../src/helpers/option';

import {dummyPollState} from './dummy';


test('add a new option to state', () => {
  // clone object
  const state = structuredClone(dummyPollState);
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

