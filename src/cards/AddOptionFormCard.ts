import BaseCard from './BaseCard';
import {PollConfig} from '../helpers/interfaces';
import {chat_v1 as chatV1} from '@googleapis/chat';

export default class AddOptionFormCard extends BaseCard {
  private readonly config: PollConfig;

  constructor(config: PollConfig) {
    super();
    this.config = config;
  }

  create(): chatV1.Schema$GoogleAppsCardV1Card {
    this.buildHeader();
    this.buildSections();
    this.buildFooter();
    return this.card;
  }

  buildHeader() {
    this.card.header = {
      'title': 'Add a new option/choice',
      'subtitle': 'Q:' + this.config.topic,
    };
  }

  buildSections() {
    this.card.sections = [
      {
        'widgets': [
          {
            'textInput': {
              'label': 'Option Name',
              'type': 'SINGLE_LINE',
              'name': 'value',
              'hintText': '',
              'value': '',
            },
            'horizontalAlignment': 'START',
          },
        ],
      },
    ];
  }

  buildFooter() {
    this.card.fixedFooter = {
      'primaryButton': {
        'text': 'Add option',
        'onClick': {
          'action': {
            'function': 'add_option',
            'parameters': [
              {
                key: 'state',
                value: JSON.stringify(this.config),
              }],
          },
        },
      },
    };
  }
}
