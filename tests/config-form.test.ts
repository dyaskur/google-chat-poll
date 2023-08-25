// @ts-ignore: it should be fine
import {default as json} from './json/configuration_form.json';
import NewPollFormCard from '../src/cards/NewPollFormCard';
import {PollConfig} from '../src/helpers/interfaces';

test('make configuration form', () => {
  const dialog = new NewPollFormCard({
    topic: 'Who is the most handsome AI?',
    choices: [],
    type: 1,
  }).createCardWithId().card;
  expect(dialog).toEqual(json);
});

test('should build a card with the correct topic and options values', () => {
  const config: PollConfig = {
    topic: 'Favorite Color',
    choices: ['Red', 'Blue', 'Green'],
  };
  const newPollFormCard = new NewPollFormCard(config);
  const sections = newPollFormCard.createMessage().cardsV2[0].card.sections;
  const topicInputSection = sections[0];
  expect(topicInputSection.widgets[1].textInput.value).toBe('Favorite Color');
  expect(topicInputSection.widgets[2].textInput.value).toBe('Red');
  expect(topicInputSection.widgets[3].textInput.value).toBe('Blue');
  expect(topicInputSection.widgets[4].textInput.value).toBe('Green');
});
