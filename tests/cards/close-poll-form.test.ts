import ClosePollFormCard from '../../src/cards/ClosePollFormCard';
import {dummyAnonymousPollState, dummyAutoclosePollState, dummyLocalTimezone} from '../dummy';

it('should return a schedule time info when the poll has auto schedule time ',
  () => {
    const closePollFormCard = new ClosePollFormCard(dummyAutoclosePollState, dummyLocalTimezone);
    const result = closePollFormCard.create();
    expect(result).toHaveProperty('header');
    expect(result).toHaveProperty('sections');
    // expect(result.sections).toMatchObject({'knownIcon':'CLOCK'});
    expect(result.sections!.find((section) => section.widgets?.[0]?.decoratedText?.startIcon?.knownIcon === 'CLOCK')).
      toBeDefined();
  });
it('should return a valid CardWithId object with cardId and card properties when createCardWithId method is called',
  () => {
    const closePollFormCard = new ClosePollFormCard(dummyAnonymousPollState, dummyLocalTimezone);
    const result = closePollFormCard.createCardWithId();
    expect(result).toEqual({
      'cardId': 'close_poll_form',
      'card': closePollFormCard.create(),
    });
  });
