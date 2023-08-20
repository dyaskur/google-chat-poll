import {PollState} from '../../src/helpers/interfaces';
import PollCard from '../../src/cards/PollCard';
import {dummyPollState} from '../dummy';
// @ts-ignore: unreasonable error
import voteCardJson from '../json/vote_card.json';

describe('PollCard', () => {
  it('should return a valid GoogleAppsCardV1Card object when create() is called', () => {
    const state: PollState = {
      topic: 'Test Topic',
      choices: ['Choice 1', 'Choice 2'],
      votes: {},
    };
    const pollCard = new PollCard(state);
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
    const pollCard = new PollCard(state).create();
    expect(pollCard.header).toBeDefined();
  });

  it('should add a section header to the card when the topic is greater than 40 characters', () => {
    const state: PollState = {
      topic: 'This is a very long topic that exceeds the character limit',
      choices: ['Choice 1', 'Choice 2'],
      votes: {},
    };
    const pollCard = new PollCard(state).create();
    expect(pollCard.sections![0]).toBeDefined();
  });

  it('should not add an "Add Option" button when optionable is false', () => {
    const state: PollState = {
      topic: 'Test Topic',
      choices: ['Choice 1', 'Choice 2'],
      votes: {},
      optionable: false,
    };
    const pollCard = new PollCard(state).create();
    expect(pollCard.sections!.find((section) => section.widgets?.[0]?.buttonList?.buttons?.[0]?.text === 'Add Option')).
      toBeUndefined();
  });

  it('should return a valid GoogleAppsCardV1Section object even when the votes array is undefined', () => {
    const state: PollState = {
      topic: 'Test Topic',
      choices: ['Choice 1', 'Choice 2'],
    };
    const pollCard = new PollCard(state);
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
    const pollCard = new PollCard(dummyPollState).createCardWithId();
    expect(pollCard.card).toEqual(voteCardJson);
  });
});
