import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';
import {BaseHandler} from './BaseHandler';
import {splitMessage} from '../helpers/utils';
import {PollCard} from '../cards/PollCard';

export class MessageHandler extends BaseHandler {
  constructor(event: chatV1.Schema$DeprecatedEvent) {
    super(event);
  }

  process(): chatV1.Schema$Message {
    const argumentText = this.event.message?.argumentText?.trim() ?? '';
    const helpResponse = {
      thread: this.event.message!.thread,
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
    };
    switch (argumentText) {
      case 'help':
        return helpResponse;
      default:
        const choices = splitMessage(argumentText);
        if (choices.length > 2) {
          const pollCard = new PollCard({
            choiceCreator: undefined,
            topic: choices.shift() ?? '',
            author: this.event.user,
            choices: choices,
            votes: {},
            anon: false,
            optionable: true,
          });
          const message = pollCard.createMessage();
          return {
            thread: this.event.message!.thread,
            actionResponse: {
              type: 'NEW_MESSAGE',
            },
            ...message,
          };
        }
        return helpResponse;
    }
  }
}
