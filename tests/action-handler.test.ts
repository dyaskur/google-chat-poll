// @ts-ignore: mock
import PollCard, {mockCreateCardWithId} from '../src/cards/PollCard';
import ActionHandler from '../src/handlers/ActionHandler';
// @ts-ignore: dummy test
import dummyAddOptionForm from './json/add_option_form.json';
import {mockCreate, mockGoogleAuth, mockUpdate} from './mocks';
import {createStatusActionResponse} from '../src/helpers/response';
import NewPollFormCard from '../src/cards/NewPollFormCard';
import {chat_v1 as chatV1} from 'googleapis';

jest.mock('../src/cards/PollCard');

jest.mock('googleapis', () => {
  return {
    google: {
      auth: {
        GoogleAuth: jest.fn(() => mockGoogleAuth),
      },
      chat: jest.fn().mockImplementation(() => {
        return {
          spaces: {
            messages: {
              create: mockCreate,
              update: mockUpdate,
            },
          },
        };
      }),
    },
  };
});

it('should add a new option to the poll state and return an "OK" status message', async () => {
  // Mock event object
  const event = {
    user: {
      displayName: 'John Doe',
    },
    common: {
      formInputs: {
        value: {
          stringInputs: {
            value: ['Option 1'],
          },
        },
      },
    },
    message: {
      name: 'messageName',
    },
  };

  // Mock getEventPollState function
  const getEventPollStateMock = jest.fn().mockReturnValue({choices: [], choiceCreator: {}});

  // Create instance of ActionHandler
  const actionHandler = new ActionHandler(event);

  // Mock getEventPollState method
  actionHandler.getEventPollState = getEventPollStateMock;

  // Call saveOption method
  const result = await actionHandler.saveOption();

  expect(getEventPollStateMock).toHaveBeenCalled();
  expect(mockUpdate).toHaveBeenCalledWith({name: 'messageName', requestBody: {cardsV2: []}, updateMask: 'cardsV2'});
  expect(result).toEqual(createStatusActionResponse('Option is added'));

  const actionHandler2 = new ActionHandler(event);

  actionHandler2.getEventPollState = getEventPollStateMock;
  mockUpdate.mockResolvedValue('');
  const result2 = await actionHandler2.saveOption();
  expect(result2).toEqual(createStatusActionResponse('Failed to add option.', 'UNKNOWN'));
});

describe('process', () => {
  it('should return a message with a poll card when the action is "start_poll"', async () => {
    // Mock the startPoll function
    const startPollMock = jest.fn().mockReturnValue({});

    // Create an instance of ActionHandler
    const actionHandler = new ActionHandler({common: {invokedFunction: 'start_poll'}});

    // Mock the startPoll function in the ActionHandler instance
    actionHandler.startPoll = startPollMock;

    // Call the process method
    await actionHandler.process();

    // Expect the startPoll  to be called
    expect(startPollMock).toHaveBeenCalled();
  });

  it('should return a message with an updated poll card when the action is "vote"', async () => {
    // Mock the recordVote function
    const recordVoteMock = jest.fn().mockReturnValue({});

    // Create an instance of ActionHandler
    const actionHandler = new ActionHandler({common: {invokedFunction: 'vote'}});

    // Mock the recordVote function in the ActionHandler instance
    actionHandler.recordVote = recordVoteMock;

    // Call the process method
    await actionHandler.process();

    // Expect the recordVote function to be called
    expect(recordVoteMock).toHaveBeenCalled();
  });

  it('should return a dialog with an add option form when the action is "add_option_form"', async () => {
    // Mock the addOptionForm function
    const addOptionFormMock = jest.fn().mockReturnValue({});

    // Create an instance of ActionHandler
    const actionHandler = new ActionHandler({common: {invokedFunction: 'add_option_form'}});

    // Mock the addOptionForm function in the ActionHandler instance
    actionHandler.addOptionForm = addOptionFormMock;

    // Call the process method
    await actionHandler.process();

    // Expect the addOptionForm function to be called
    expect(addOptionFormMock).toHaveBeenCalled();
  });
  it('should return a dialog with an add option form when the action is "add_option_form"', async () => {
    // Mock the addOptionForm function
    const addOptionFormMock = jest.fn().mockReturnValue({});

    // Create an instance of ActionHandler
    const actionHandler = new ActionHandler({common: {invokedFunction: 'add_option_form'}});

    // Mock the addOptionForm function in the ActionHandler instance
    actionHandler.addOptionForm = addOptionFormMock;

    // Call the process method
    await actionHandler.process();

    // Expect the addOptionForm function to be called
    expect(addOptionFormMock).toHaveBeenCalled();
  });

  it('should create a dialog with AddOptionFormCard and return it as an actionResponse', () => {
    // Arrange
    const card = {
      sections: [
        {
          widgets: [
            {
              decoratedText: {
                button: {
                  onClick: {
                    action: {
                      parameters: [
                        {
                          value: '{"topic":"Who is the most handsome AI?", "choices": []}',
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    };
    const cardWithId: chatV1.Schema$CardWithId = {
      cardId: 'cardId',
      card,
    };
    const event = {
      message: {
        cardsV2: [cardWithId],
      },
    };
    const expectedDialog = {
      body: dummyAddOptionForm,
    };
    const actionHandler = new ActionHandler(event);
    actionHandler.getEventPollState = jest.fn().
      mockReturnValue({'topic': 'Who is the most handsome AI?', 'choices': []});
    // Act
    const result = actionHandler.addOptionForm();

    // Assert
    expect(result).toEqual({
      actionResponse: {
        type: 'DIALOG',
        dialogAction: {
          dialog: expectedDialog,
        },
      },
    });
  });

  // Tests that the 'add_option' action returns a message with an updated poll card
  it('should return a message with an updated poll card when the action is "add_option"', async () => {
    // Mock the saveOption function
    const saveOptionMock = jest.fn().mockReturnValue({});

    // Create an instance of ActionHandler
    const actionHandler = new ActionHandler({common: {invokedFunction: 'add_option'}});

    // Mock the saveOption function in the ActionHandler instance
    actionHandler.saveOption = saveOptionMock;

    // Call the process method
    await actionHandler.process();

    // Expect the saveOption function to be called
    expect(saveOptionMock).toHaveBeenCalled();
  });

  // Tests that the 'unknown' action returns a message with an updated poll card
  it('should return a message with an updated poll card when the action is "add_option"', async () => {
    // Create an instance of ActionHandler
    const actionHandler = new ActionHandler({common: {invokedFunction: 'unknown'}});

    // Call the process method
    const result = await actionHandler.process();

    // Expect the saveOption function to be called
    expect(result).toEqual(createStatusActionResponse('Unknown action!', 'UNKNOWN'));
  });
});

describe('startPoll', () => {
  // Tests that a valid form is submitted and a poll card is created and displayed in the space
  it('should create and display poll card when valid form is submitted', async () => {
    const event = {
      common: {
        invokedFunction: 'start_poll',
        formInputs: {
          topic: {stringInputs: {value: ['Topic']}},
          is_anonymous: {stringInputs: {value: ['1']}},
          allow_add_option: {stringInputs: {value: ['1']}},
          option0: {stringInputs: {value: ['Option 1']}},
          option1: {stringInputs: {value: ['Option 2']}},
        },
      },
      user: {displayName: 'User'},
      space: {name: 'Space'},
    };
    const actionHandler = new ActionHandler(event);

    const result = await actionHandler.startPoll();
    const pollCard = new PollCard({
      topic: 'Topic',
      choiceCreator: undefined,
      author: event.user,
      choices: ['Option 1', 'Option 2'],
      votes: {'0': [], '1': []},
      anon: true,
      optionable: true,
    }).createCardWithId();
    // Valid configuration, make the voting card to display in the space
    const message = {
      cardsV2: [pollCard],
    };
    const request = {
      parent: event.space?.name,
      requestBody: message,
    };

    expect(result).toEqual(createStatusActionResponse('Poll started.', 'OK'));
    expect(mockCreate).toHaveBeenCalledWith(request);

    // when google API return invalid data, it should return an error message
    mockCreate.mockResolvedValue('');
    const actionHandler2 = new ActionHandler(event);
    const result2 = await actionHandler2.startPoll();
    expect(result2).toEqual(createStatusActionResponse('Failed to start poll.', 'UNKNOWN'));
  });

  // Tests that an incomplete form is submitted and the form is rerendered
  it('should rerender form when incomplete form is submitted', async () => {
    // Mock event object
    const event = {
      common: {
        formInputs: {
          option0: {stringInputs: {value: ['Option 1']}},
        },
      },
    };

    const actionHandler = new ActionHandler(event);

    const result = await actionHandler.startPoll();

    expect(result).toEqual({
      actionResponse: {
        type: 'DIALOG',
        dialogAction: {
          dialog: {
            body: new NewPollFormCard({
              topic: '',
              choices: ['Option 1'],
            }).create(),
          },
        },
      },
    });
  });
});
describe('recordVote', () => {
  it('should throw an error if the index parameter is missing', () => {
    const event = {
      common: {
        parameters: {},
      },
    };
    const actionHandler = new ActionHandler(event);

    expect(() => actionHandler.recordVote()).toThrow('Index Out of Bounds');
    expect(() => actionHandler.getEventPollState()).toThrow('no valid state in the event');
  });
  it('should update an existing vote with a new vote', () => {
    const event = {
      common: {
        parameters: {
          index: '1',
          state: '{"votes": {"0": [{"uid": "userId", "name": "userName"}]}, "anon": false}',
        },
      },
      user: {
        name: 'userId2',
        displayName: 'userName2',
      },
      message: {
        thread: {
          'name': 'spaces/AAAAN0lf83o/threads/DJXfo5DXcTA',
        },
      },
    };
    const actionHandler = new ActionHandler(event);
    const response = actionHandler.recordVote();

    const expectedResponse = {
      thread: {
        'name': 'spaces/AAAAN0lf83o/threads/DJXfo5DXcTA',
      },
      actionResponse: {
        type: 'UPDATE_MESSAGE',
      },
      cardsV2: ['card'],
    };
    const expectedPollState = {
      votes: {
        '0': [{uid: 'userId', name: 'userName'}],
        '1': [{uid: 'userId2', name: 'userName2'}],
      }, anon: false,
    };
    expect(PollCard).toHaveBeenCalledWith(expectedPollState);
    expect(mockCreateCardWithId).toHaveBeenCalled();
    expect(response).toEqual(expectedResponse);
    expect(actionHandler.getEventPollState()).toEqual({
      votes: {
        '0': [{uid: 'userId', name: 'userName'}],
      }, anon: false,
    });
  });
});
