import {PollState} from '../../src/helpers/interfaces';
import {PollCard} from '../../src/cards/PollCard';

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
  });
});
