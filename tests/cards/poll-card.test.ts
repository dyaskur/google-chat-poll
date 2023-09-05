import {ClosableType, PollState} from '../../src/helpers/interfaces';
import PollCard from '../../src/cards/PollCard';
import {dummyAutoclosePollState, dummyLocalTimezone, dummyPollState} from '../dummy';
// @ts-ignore: unreasonable error
import voteCardJson from '../json/vote_card.json';

describe('PollCard', () => {
  it('should return a valid GoogleAppsCardV1Card object when create() is called', () => {
    const state: PollState = {
      topic: 'Test Topic',
      choices: ['Choice 1', 'Choice 2'],
      votes: {},
    };
    const pollCard = new PollCard(state, dummyLocalTimezone);
    const result = pollCard.create();
    expect(result).toBeDefined();
    expect(result.sections).toBeDefined();
  });

  it('should add a header to the card when the topic is less than or equal to 40 characters', () => {
    const state: PollState = {
      topic: 'Test Topic',
      choices: ['Choice 1', 'Choice 2'],
      votes: {},
    };
    const pollCard = new PollCard(state, dummyLocalTimezone).create();
    expect(pollCard.header).toBeDefined();
  });

  it('should add a section header to the card when the topic is greater than 40 characters', () => {
    const state: PollState = {
      topic: 'This is a very long topic that exceeds the character limit',
      choices: ['Choice 1', 'Choice 2'],
      votes: {},
    };
    const pollCard = new PollCard(state, dummyLocalTimezone).create();
    expect(pollCard.header).toBeUndefined();
    expect(pollCard.sections![0].widgets![0].decoratedText.text).toEqual(state.topic);
  });

  it('should not add an "Add Option" button when optionable is false', () => {
    const state: PollState = {
      topic: 'Test Topic',
      choices: ['Choice 1', 'Choice 2'],
      votes: {},
      optionable: false,
      closedTime: 1,
    };
    const pollCard = new PollCard(state, dummyLocalTimezone).create();
    expect(pollCard.sections!.find((section) => section.widgets?.[0]?.buttonList?.buttons?.[0]?.text === 'Add Option')).
      toBeUndefined();
    const closeButton = pollCard.sections!.find((section) => section.widgets?.[0]?.buttonList?.buttons?.[0]?.disabled);
    // since closedTime < now the close button is disabled
    expect(closeButton.widgets?.[0]?.buttonList?.buttons?.[0]?.disabled).toEqual(true);
    const voteButton = pollCard.sections!.find((section) => {
      const button = section.widgets?.[0]?.decoratedText.button;
      return button?.text === 'vote' && button.disabled === true;
    });
    expect(voteButton).toBeDefined();
  });

  it('should not add any button when the type is UNCLOSEABLE and optionable is false', () => {
    const state: PollState = {
      topic: 'Test Topic',
      choices: ['Choice 1', 'Choice 2'],
      votes: {},
      optionable: false,
      type: ClosableType.UNCLOSEABLE,
    };
    const pollCard = new PollCard(state, dummyLocalTimezone).create();
    // since optionable
    expect(pollCard.sections!.find((section) => section.widgets?.[0]?.buttonList?.buttons?.[0]?.text === 'Add Option')).
      toBeUndefined();
    // because default if closable is not defined is true
    expect(pollCard.sections!.find((section) => section.widgets?.[0]?.buttonList?.buttons?.[1]?.text === 'Close Poll')).
      toBeUndefined();
  });

  it('should return a valid GoogleAppsCardV1Section object even when the votes array is undefined', () => {
    const state: PollState = {
      topic: 'Test Topic',
      choices: ['Choice 1', 'Choice 2'],
    };
    const pollCard = new PollCard(state, dummyLocalTimezone);
    const result = pollCard.choiceSection(0, 0);
    expect(result).toBeDefined();
    expect(result.widgets).toBeDefined();
    expect(result.widgets?.[0]?.decoratedText?.topLabel).toBeUndefined();

    // create choice section with the creator name (when added from new option)
    const result2 = pollCard.choiceSection(1, 0, 'Ahmad');
    expect(result2).toBeDefined();
    expect(result2.widgets?.[0]?.decoratedText?.topLabel).toEqual('Added by Ahmad');
  });

  it('build vote card with dummy state', () => {
    const pollCard = new PollCard(dummyPollState, dummyLocalTimezone).createCardWithId();
    expect(pollCard.card).toEqual(voteCardJson);
  });

  it('if closedTime > now, it should show a clock icon which indicate that poll has autoClose schedule', () => {
    const pollCard = new PollCard(dummyAutoclosePollState, dummyLocalTimezone).create();
    expect(pollCard.sections.find((section) => section.widgets?.[0]?.decoratedText?.startIcon?.knownIcon === 'CLOCK')).
      toBeDefined();
  });

  it('if poll has autoClose schedule but has invalid timezone the icon is not showed', () => {
    const pollCard = new PollCard(dummyAutoclosePollState, {
      id: 'Invalid/Timezone',
      offset: 25200000,
      locale: 'en-US',
    }).create();
    expect(pollCard.sections.find((section) => section.widgets?.[0]?.decoratedText?.startIcon?.knownIcon === 'CLOCK')).
      toBeUndefined();
  });
});
