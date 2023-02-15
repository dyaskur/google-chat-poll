const {saveVoter} = require('./vote');
const {progressBarText} = require('./vote');

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
  const choice = 2;
  const voterResult = saveVoter(choice, voter, votes);
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
});


test("build progress bar text", () => {
  const progressBar = progressBarText(2, 4);

  expect(progressBar).toBe('▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀')
});
