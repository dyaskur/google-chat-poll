const {buildVoteCard} = require('../src/vote-card');
const voteCardJson = require('./json/vote_card.json');
const {dummyPoll} = require('./dummy');
const {saveVotes, choiceSection, progressBarText} = require('../helpers/vote');

test('test save voter', () => {
  const voter = {uid: 'users/103846892623842357554', name: 'Muhammad'};
  const votes = {
    '0': [],
    '1': [],
    '2': [{uid: 'users/118239915905237561078', name: 'Yaskur'}],
    '3': [
      {uid: 'users/123242424242323423423', name: 'Dyas'},
      {uid: 'users/103846892623842357554', name: 'Muhammad'},
      {uid: 'users/222423423523532523532', name: 'Ammar'},
    ],
  };
  const voterResult = saveVotes(2, voter, votes);
  expect(voterResult).toStrictEqual({
    '0': [],
    '1': [],
    '2': [
      {uid: 'users/118239915905237561078', name: 'Yaskur'},
      {uid: 'users/103846892623842357554', name: 'Muhammad'},
    ],
    '3': [
      {uid: 'users/123242424242323423423', name: 'Dyas'},
      {uid: 'users/222423423523532523532', name: 'Ammar'},
    ],
  });

  const voterResult2 = saveVotes(1, voter, votes);

  expect(voterResult2).toStrictEqual({
    '0': [],
    '1': [{uid: 'users/103846892623842357554', name: 'Muhammad'}],
    '2': [
      {uid: 'users/118239915905237561078', name: 'Yaskur'},
    ],
    '3': [
      {uid: 'users/123242424242323423423', name: 'Dyas'},
      {uid: 'users/222423423523532523532', name: 'Ammar'},
    ],
  });
});
test('test save voter anonymously', () => {
  const voter = {uid: 'users/103846892623842357554', name: 'Muhammad'};
  const votes = {
    '0': [],
    '1': [],
    '2': [],
    '3': [],
  };
  const voterResult = saveVotes(2, voter, votes, true);
  expect(voterResult).toStrictEqual({
    '0': [],
    '1': [],
    '2': [
      {uid: 'users/103846892623842357554'},
    ],
    '3': [],
  });

  const voterResult2 = saveVotes(1, voter, votes, true);

  expect(voterResult2).toStrictEqual({
    '0': [],
    '1': [{uid: 'users/103846892623842357554'}],
    '2': [],
    '3': [],
  });
});

test('build progress bar text', () => {
  const progressBar = progressBarText(2, 4);

  expect(progressBar).toBe('▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀');
});

test('build choice section ', () => {
  const state = JSON.stringify(dummyPoll);
  const normalChoice = choiceSection(2, dummyPoll, 4, state,
      'Muhammad Dyas Yaskur');

  expect(normalChoice).
      toStrictEqual({
        'collapsible': true,
        'uncollapsibleWidgetsCount': 1,
        'widgets': [
          {
            'decoratedText': {
              'topLabel': 'Added by Muhammad Dyas Yaskur',
              'bottomLabel': progressBarText(2, 4) + ' 2',
              'button': {
                'onClick': {
                  'action': {
                    'function': 'vote',
                    'parameters': [
                      {
                        'key': 'state',
                        'value': JSON.stringify(dummyPoll),
                      }, {'key': 'index', 'value': '2'}],
                  },
                }, 'text': 'vote',
              },
              'text': 'Coco Worm',
            },
          }, {'textParagraph': {'text': 'Isa bin Maryam, Musa bin Imran'}}],
      });

  dummyPoll.anon = true;
  const anonymousChoice = choiceSection(2, dummyPoll, 4,
      JSON.stringify(dummyPoll));
  expect(anonymousChoice).toStrictEqual({
    'widgets': [
      {
        'decoratedText': {
          'bottomLabel': progressBarText(2, 4) + ' 2',
          'button': {
            'onClick': {
              'action': {
                'function': 'vote',
                'parameters': [
                  {
                    'key': 'state',
                    'value': JSON.stringify(dummyPoll),
                  }, {'key': 'index', 'value': '2'}],
              },
            }, 'text': 'vote',
          },
          'text': 'Coco Worm',
        },
      }],
  });
  dummyPoll.anon = false;
});

test('build vote card', () => {
  const pollCard = buildVoteCard(dummyPoll);

  expect(pollCard.card).toStrictEqual(voteCardJson);
});
