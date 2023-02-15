const {buildVoteCard,progressBarText} = require('../vote-card');
const json = require('./json/vote-card.json');

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
    votes: {
      '0': [],
      '1': [],
      '2': [
        {uid: 'users/118239915905237561078', name: 'Isa bin Maryam'},
        {uid: 'users/103846892623842357554', name: 'Musa bin Imran'},
      ],
      '3': [
        {uid: 'users/123242424242323423423', name: 'Ismail bin Ibrahim'},
        {uid: 'users/222423423523532523532', name: 'Ishaq bin Ibrahim'},
      ],
      '4': []
    },
  });
  const json = require('./json/vote-card.json');

  expect(pollCard.card).toStrictEqual(json);
});
