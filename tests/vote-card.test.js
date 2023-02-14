const {buildVoteCard} = require('../vote-card');

test('build vote card', () => {
  const pollCard = buildVoteCard({
    topic: 'What is the most beautiful worms?',
    author: 'Dyas Yaskur',
    choices: [
      'Feather Duster Worm',
      'Christmas Tree Worm',
      'Coco Worm',
      'Bearded Fireworm',
      'Giant Tube Worm'],
    votes: {},
  });
  const json = require('./json/vote-card.json');
  expect(pollCard.card).toStrictEqual(json);
});
