import {dummyPollState, dummyLocalTimezone} from './dummy';
import {saveVotes, progressBarText} from '../src/helpers/vote';
import {PollState, Votes} from '../src/helpers/interfaces';
import PollCard from '../src/cards/PollCard';

test('test save voter', () => {
  const voter = {uid: 'users/103846892623842357554', name: 'Muhammad'};
  const votes: Votes = {
    '0': [],
    '1': [],
    '2': [{uid: 'users/118239915905237561078', name: 'Yaskur'}],
    '3': [
      {uid: 'users/123242424242323423423', name: 'Dyas'},
      {uid: 'users/103846892623842357554', name: 'Muhammad'},
      {uid: 'users/222423423523532523532', name: 'Ammar'},
    ],
  };
  const state: PollState = {
    votes,
  };
  const voterResult = saveVotes(2, voter, state);
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

  const voterResult2 = saveVotes(1, voter, state);

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
  const votes: Votes = {
    '0': [],
    '1': [],
    '2': [],
    '3': [],
  };

  const state: PollState = {
    votes,
    anon: true,
  };
  const voterResult = saveVotes(2, voter, state);
  expect(voterResult).toStrictEqual({
    '0': [],
    '1': [],
    '2': [
      {uid: 'users/103846892623842357554'},
    ],
    '3': [],
  });

  const voterResult2 = saveVotes(4, voter, state);

  expect(voterResult2).toStrictEqual({
    '0': [],
    '1': [],
    '2': [],
    '3': [],
    '4': [{uid: 'users/103846892623842357554'}],
  });
});
test('test save voter multiple vote allowed', () => {
  const voter = {uid: 'users/103846892623842357554', name: 'Muhammad'};
  const votes: Votes = {
    '0': [],
    '1': [],
    '2': [],
    '3': [],
  };
  const state: PollState = {
    voteLimit: 2,
    votes,
    anon: true,
  };
  const voterResult = saveVotes(2, voter, state);
  expect(voterResult).toStrictEqual({
    '0': [],
    '1': [],
    '2': [
      {uid: 'users/103846892623842357554'},
    ],
    '3': [],
  });

  const voterResult2 = saveVotes(4, voter, state);

  expect(voterResult2).toStrictEqual({
    '0': [],
    '1': [],
    '2': [{uid: 'users/103846892623842357554'}],
    '3': [],
    '4': [{uid: 'users/103846892623842357554'}],
  });

  const voterResult3 = saveVotes(3, voter, state);

  expect(voterResult3).toStrictEqual({
    '0': [],
    '1': [],
    '2': [],
    '3': [{uid: 'users/103846892623842357554'}],
    '4': [{uid: 'users/103846892623842357554'}],
  });

  const voterResult4 = saveVotes(3, voter, state);

  expect(voterResult4).toStrictEqual({
    '0': [],
    '1': [],
    '2': [],
    '3': [],
    '4': [{uid: 'users/103846892623842357554'}],
  });
});

test('build progress bar text', () => {
  const progressBar = progressBarText(2, 4);

  expect(progressBar).toBe('██████████████████');
});

test('build choice section ', () => {
  const pollCard = new PollCard(dummyPollState, dummyLocalTimezone);
  const normalChoice = pollCard.choiceSection(2, 4, 'Muhammad Dyas Yaskur');

  expect(normalChoice).
    toMatchObject({
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
                    {'key': 'index', 'value': '2'}],
                },
              }, 'text': 'vote',
            },
            'text': 'Coco Worm',
            'wrapText': true,
          },
        }, {'textParagraph': {'text': 'Isa bin Maryam, Musa bin Imran'}}],
    });

  dummyPollState.anon = true;
  const anonCard = new PollCard(dummyPollState, dummyLocalTimezone);
  const anonymousChoice = anonCard.choiceSection(2, 4);
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
                  {'key': 'index', 'value': '2'}],
              },
            }, 'text': 'vote',
          },
          'text': 'Coco Worm',
          'wrapText': true,
        },
      }],
  });
  dummyPollState.anon = false;
});
