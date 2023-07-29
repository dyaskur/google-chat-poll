const topic = 'What is the most beautiful worms?';
const choices = [
  'Feather Duster Worm',
  'Christmas Tree Worm',
  'Coco Worm',
  'Bearded Fireworm',
  'Giant Tube Worm'];
const author = {user: 'user/11111', displayName: 'Dyas Yaskur'};
const votes = {
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
  '4': [],
};
export const dummyPoll = {
  topic: topic,
  author: author,
  choices: choices,
  votes: votes,
  anon: false,
  optionable: true,
};
