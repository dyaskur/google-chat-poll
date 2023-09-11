import {chat_v1 as chatV1} from '@googleapis/chat';
import BaseHandler from './BaseHandler';
import {splitMessage} from '../helpers/utils';
import PollCard from '../cards/PollCard';
import {generateHelpText} from '../helpers/helper';

export default class MessageHandler extends BaseHandler {
  process(): chatV1.Schema$Message {
    const argumentText = this.event.message?.argumentText?.trim() ?? '';
    const buttonCard: chatV1.Schema$CardWithId = {
      'cardId': 'welcome-card',
      'card': {
        'sections': [
          {
            'widgets': [
              {
                'buttonList': {
                  'buttons': [
                    {
                      'text': 'Create Poll',
                      'onClick': {
                        'action': {
                          'function': 'show_form',
                          'interaction': 'OPEN_DIALOG',
                          'parameters': [],
                        },
                      },
                    },
                    {
                      'text': 'Contact Us',
                      'onClick': {
                        'openLink': {
                          'url': 'https://github.com/dyaskur/google-chat-poll/issues',
                        },
                      },
                    },
                    {
                      'text': 'Give Us a Star',
                      'onClick': {
                        'openLink': {
                          'url': 'https://github.com/dyaskur/google-chat-poll',
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    };

    const helpResponse = {
      thread: this.event.message!.thread,
      actionResponse: {
        type: 'NEW_MESSAGE',
      },
      text: '',
      cardsV2: [buttonCard],
    };
    const isPrivate = this.event!.space?.type === 'DM';

    switch (argumentText) {
      case 'help':
        helpResponse.text = generateHelpText(isPrivate);
        return helpResponse;
      case 'test dyas':
        helpResponse.text = 'Hello <https://github.com/dyaskur/google-chat-poll|google-chat-poll>';
        return helpResponse;
      default:
        const choices = splitMessage(argumentText);
        const annotation = this.getAnnotationByType('USER_MENTION');
        if (annotation && choices.length > 2) {
          const pollCard = new PollCard({
            choiceCreator: undefined,
            topic: choices.shift() ?? '',
            author: this.event.user,
            choices: choices,
            votes: {},
            anon: false,
            optionable: true,
          }, this.getUserTimezone());
          const message = pollCard.createMessage();
          return {
            thread: this.event.message!.thread,
            actionResponse: {
              type: 'NEW_MESSAGE',
            },
            ...message,
          };
        }
        helpResponse.text = generateHelpText(isPrivate);
        return helpResponse;
    }
  }
}
