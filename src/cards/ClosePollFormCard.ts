import BaseCard from './BaseCard';
import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';

export default class ClosePollFormCard extends BaseCard {
  create(): chatV1.Schema$GoogleAppsCardV1Card {
    this.buildHeader();
    this.buildSections();
    this.buildFooter();
    return this.card;
  }

  buildHeader() {
    this.card.header = {
      'title': 'Are you sure to close the poll?',
      'subtitle': 'No one will have the ability to vote.',
      'imageUrl': '',
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

  buildFooter() {
    this.card.fixedFooter = {
      'primaryButton': {
        'text': 'Close Poll',
        'onClick': {
          'action': {
            'function': 'close_poll',
            'parameters': [],
          },
        },
      },
    };
  }
}
