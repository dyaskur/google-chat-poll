import MessageHandler from '../src/handlers/MessageHandler';
import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';
import PollCard from '../src/cards/PollCard';

describe('process', () => {
  // Tests that the method returns the help response when the argumentText is empty
  it('should return the help response when the argumentText is empty', () => {
    // Arrange
    const event: chatV1.Schema$DeprecatedEvent = {
      message: {
        argumentText: '',
        thread: {
          'name': 'spaces/AAAAN0lf83o/threads/DJXfo5DXcTA',
        },
      },
    };
    const messageHandler = new MessageHandler(event);

    // Act
    const result = messageHandler.process();

    // Assert
    expect(result).toMatchObject({
      thread: {
        'name': 'spaces/AAAAN0lf83o/threads/DJXfo5DXcTA',
      },
      actionResponse: {
        type: 'NEW_MESSAGE',
      },
    });
    expect(result.text).toContain('Below is an example commands:');
    expect(result).toHaveProperty('cardsV2');
  });

  it('should return the help response with additional message', () => {
    // Arrange
    const event: chatV1.Schema$DeprecatedEvent = {
      message: {
        argumentText: 'hi',
        thread: {
          'name': 'spaces/AAAAN0lf83o/threads/DJXfo5DXcTA',
        },
      },
      space: {
        type: 'DM',
      },
    };
    const messageHandler = new MessageHandler(event);

    // Act
    const result = messageHandler.process();

    // Assert
    expect(result).toMatchObject({
      thread: {
        'name': 'spaces/AAAAN0lf83o/threads/DJXfo5DXcTA',
      },
      actionResponse: {
        type: 'NEW_MESSAGE',
      },
    });
    expect(result.text).toContain('Below is an example commands:');
    expect(result.text).toContain('group');
    expect(result).toHaveProperty('cardsV2');
  });

  // Tests that the method returns the help response when the argumentText has less than 3 choices
  it('should return the help response when the argumentText has less than 3 choices', () => {
    // Arrange
    const event: chatV1.Schema$DeprecatedEvent = {
      message: {
        argumentText: 'topic choice1 choice2',
        thread: {
          'name': 'spaces/AAAAN0lf83o/threads/DJXfo5DXcTA',
        },
        annotations: [
          {
            'type': 'USER_MENTION',
            'startIndex': 0,
            'length': 7,
            'userMention': {
              'user': {
                'name': 'users/100819441865491039935',
                'displayName': 'Absolute Poll',
                'type': 'BOT',
              },
              'type': 'MENTION',
            },
          },
        ],

      },
      user: {name: 'zzz'},
    };
    const messageHandler = new MessageHandler(event);

    // Act
    const result = messageHandler.process();

    const expectedCard = new PollCard({
      choiceCreator: undefined,
      topic: 'topic',
      author: {name: 'zzz'},
      choices: ['choice1', 'choice2'],
      votes: {},
      anon: false,
      optionable: true,
    }).createCardWithId();
    expect(result).toEqual({
      thread: {
        'name': 'spaces/AAAAN0lf83o/threads/DJXfo5DXcTA',
      },
      actionResponse: {
        type: 'NEW_MESSAGE',
      },
      cardsV2: [expectedCard],
    });
  });

  // Tests that the method returns the help response when the argumentText has only one choice
  it('should return the help response when the argumentText has only one choice', () => {
    // Arrange
    const event = {
      message: {
        argumentText: 'help',
        thread: {
          'name': 'spaces/AAAAN0lf83o/threads/DJXfo5DXcTA',
        },
      },
    };
    const messageHandler = new MessageHandler(event);

    // Act
    const result = messageHandler.process();

    // Assert
    expect(result).toMatchObject({
      thread: {
        'name': 'spaces/AAAAN0lf83o/threads/DJXfo5DXcTA',
      },
      actionResponse: {
        type: 'NEW_MESSAGE',
      },
    });
    expect(result).toHaveProperty('text');
  });
});
