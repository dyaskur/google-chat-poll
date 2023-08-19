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
    expect(result).toEqual({
      thread: {
        'name': 'spaces/AAAAN0lf83o/threads/DJXfo5DXcTA',
      },
      actionResponse: {
        type: 'NEW_MESSAGE',
      },
      text: 'Hi there! I can help you create polls to enhance collaboration and efficiency ' +
        'in decision-making using Google Chat™.\n' +
        '\n' +
        'Below is an example commands:\n' +
        '`/poll` - You will need to fill out the topic and answers in the form that will be displayed.\n' +
        '`/poll "Which is the best country to visit" "Indonesia"` - to create a poll with ' +
        '"Which is the best country to visit" as the topic and "Indonesia" as the answer\n' +
        '\n' +
        'We hope you find our service useful and please don\'t hesitate to contact us ' +
        'if you have any questions or concerns.',
    });
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
    expect(result).toEqual({
      thread: {
        'name': 'spaces/AAAAN0lf83o/threads/DJXfo5DXcTA',
      },
      actionResponse: {
        type: 'NEW_MESSAGE',
      },
      text: 'Hi there! I can help you create polls to enhance collaboration and efficiency ' +
        'in decision-making using Google Chat™.\n' +
        '\n' +
        'Below is an example commands:\n' +
        '`/poll` - You will need to fill out the topic and answers in the form that will be displayed.\n' +
        '`/poll "Which is the best country to visit" "Indonesia"` - to create a poll with ' +
        '"Which is the best country to visit" as the topic and "Indonesia" as the answer\n' +
        '\n' +
        'We hope you find our service useful and please don\'t hesitate to contact us ' +
        'if you have any questions or concerns.',
    });
  });
});
