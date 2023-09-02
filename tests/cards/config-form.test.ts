// @ts-ignore: it should be fine
import {default as json} from '../json/configuration_form.json';
import NewPollFormCard from '../../src/cards/NewPollFormCard';
import {PollForm} from '../../src/helpers/interfaces';

test('make configuration form', () => {
  const dialog = new NewPollFormCard({
    topic: 'Who is the most handsome AI?',
    choices: [],
    type: 1,
  }).createCardWithId().card;
  expect(dialog).toEqual(json);
});

test('should build a card with the correct topic and options values', () => {
  const config: PollForm = {
    topic: 'Favorite Color',
    choices: ['Red', 'Blue', 'Green'],
    autoclose: true,
  };
  const newPollFormCard = new NewPollFormCard(config, {id: 'GMT+1', offset: 3600000});
  const sections = newPollFormCard.createMessage().cardsV2[0].card.sections;
  const topicInputSection = sections[0];
  expect(topicInputSection.widgets[1].textInput.value).toBe('Favorite Color');
  expect(topicInputSection.widgets[2].textInput.value).toBe('Red');
  expect(topicInputSection.widgets[3].textInput.value).toBe('Blue');
  expect(topicInputSection.widgets[4].textInput.value).toBe('Green');
  const closeConfigSection = sections[2];
  expect(closeConfigSection.widgets[1].decoratedText.switchControl.selected).toBe(true);
  expect(closeConfigSection.widgets[2].dateTimePicker).toBeDefined();
});
