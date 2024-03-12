import {dummyPollState} from './dummy';
// @ts-ignore: unreasonable error
import {saveVotes, choiceSection, progressBarText} from '../src/helpers/vote';
import {Votes} from '../src/helpers/interfaces';

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
  const votes: Votes = {
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

  const voterResult2 = saveVotes(4, voter, votes, true);

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
  const voterResult = saveVotes(2, voter, votes, true, 2);
  expect(voterResult).toStrictEqual({
    '0': [],
    '1': [],
    '2': [
      {uid: 'users/103846892623842357554'},
    ],
    '3': [],
  });

  const voterResult2 = saveVotes(4, voter, votes, true, 2);

  expect(voterResult2).toStrictEqual({
    '0': [],
    '1': [],
    '2': [{uid: 'users/103846892623842357554'}],
    '3': [],
    '4': [{uid: 'users/103846892623842357554'}],
  });

  const voterResult3 = saveVotes(3, voter, votes, true, 2);

  expect(voterResult3).toStrictEqual({
    '0': [],
    '1': [],
    '2': [],
    '3': [{uid: 'users/103846892623842357554'}],
    '4': [{uid: 'users/103846892623842357554'}],
  });

  const voterResult4 = saveVotes(3, voter, votes, true, 2);

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
  const state = JSON.stringify(dummyPollState);
  const normalChoice = choiceSection(2, dummyPollState, 4, state, 'Muhammad Dyas Yaskur');

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
                      'value': JSON.stringify(dummyPollState),
                    }, {'key': 'index', 'value': '2'}],
                },
              }, 'text': 'vote',
            },
            'text': 'Coco Worm',
          },
        }, {'textParagraph': {'text': 'Isa bin Maryam, Musa bin Imran'}}],
    });

  dummyPollState.anon = true;
  const anonymousChoice = choiceSection(2, dummyPollState, 4,
    JSON.stringify(dummyPollState));
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
                    'value': JSON.stringify(dummyPollState),
                  }, {'key': 'index', 'value': '2'}],
              },
            }, 'text': 'vote',
          },
          'text': 'Coco Worm',
        },
      }],
  });
  dummyPollState.anon = false;
});
