import ClosePollFormCard from '../../src/cards/ClosePollFormCard';

it('should return a valid GoogleAppsCardV1Card object with header, sections, and footer when create method is called',
  () => {
    const closePollFormCard = new ClosePollFormCard();
    const result = closePollFormCard.create();
    expect(result).toHaveProperty('header');
    expect(result).toHaveProperty('sections');
    expect(result).toHaveProperty('fixedFooter');
  });
it('should return a valid CardWithId object with cardId and card properties when createCardWithId method is called',
  () => {
    const closePollFormCard = new ClosePollFormCard();
    const result = closePollFormCard.createCardWithId();
    expect(result).toEqual({
      'cardId': 'cardId',
      'card': closePollFormCard.create(),
    });
  });
