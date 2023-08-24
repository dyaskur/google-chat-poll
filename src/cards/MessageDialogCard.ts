import BaseCard from './BaseCard';
import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';
import {MessageDialogConfig} from '../helpers/interfaces';

export default class MessageDialogCard extends BaseCard {
  private readonly config: MessageDialogConfig;

  constructor(config: MessageDialogConfig) {
    super();
    this.config = config;
  }

  create(): chatV1.Schema$GoogleAppsCardV1Card {
    this.buildHeader();
    this.buildSections();
    return this.card;
  }

  buildHeader() {
    this.card.header = {
      'title': this.config.title,
      'subtitle': this.config.message,
      'imageUrl': this.config.imageUrl,
      'imageType': 'CIRCLE',
    };
  }

  buildSections() {
    this.card.sections = [
      {
        'widgets': [
          {
            'divider': {},
          },
          {
            'divider': {},
          },
          {
            'divider': {},
          },
          {
            'divider': {},
          },
          {
            'textParagraph': {
              'text': 'If you have any problems, questions, or feedback, ' +
                'please feel free to post them <a href="https://github.com/dyaskur/google-chat-poll/issues">here</a> ',
            },
          }],
      }];
  }
}
