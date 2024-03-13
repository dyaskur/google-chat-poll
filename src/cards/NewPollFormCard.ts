import BaseCard from './BaseCard';
import {ClosableType, LocaleTimezone, PollForm} from '../helpers/interfaces';
import {MAX_NUM_OF_OPTIONS} from '../config/default';
import {chat_v1 as chatV1} from '@googleapis/chat';
import {offsetToTimezone} from '../helpers/time';
import {createButton} from '../helpers/cards';

export default class NewPollFormCard extends BaseCard {
  private config: PollForm;
  private timezone: LocaleTimezone;

  constructor(config: PollForm, timezone: LocaleTimezone) {
    super();
    this.config = config;
    this.timezone = timezone;
  }

  create() {
    this.buildSections();
    this.buildFooter();
    return this.card;
  }

  buildSections() {
    this.buildTopicInputSection();
    this.buildOptionSwitchSection();
    this.buildCloseConfigSection();
    if (this.config.autoClose) {
      this.buildAutoCloseSection();
    }
    this.buildMultipleVoteSection();
  }

  buildTopicInputSection() {
    const widgets = [];
    widgets.push(this.buildHelpText());
    widgets.push(this.topicInput(this.config.topic));
    for (let i = 0; i < MAX_NUM_OF_OPTIONS; ++i) {
      const choice = this.config.choices?.[i];
      widgets.push(this.optionInput(i, choice));
    }
    this.card.sections!.push({
      'collapsible': true,
      'uncollapsibleWidgetsCount': 6,
      widgets,
    });
  }

  buildOptionSwitchSection() {
    this.card.sections!.push({
      'widgets': [
        {
          'decoratedText': {
            'bottomLabel': 'If this checked the voters name will be not shown',
            'text': 'Anonymous voter',
            'switchControl': {
              'controlType': 'SWITCH',
              'name': 'is_anonymous',
              'value': '1',
              'selected': this.config.anon ?? false,
            },
          },
          'horizontalAlignment': 'CENTER',
        },
        {
          'decoratedText': {
            'bottomLabel': 'After the poll is created, other member can add more option',
            'text': 'Allow to add more option(s)',
            'switchControl': {
              'controlType': 'SWITCH',
              'name': 'allow_add_option',
              'value': '1',
              'selected': this.config.optionable ?? true,
            },
          },
          'horizontalAlignment': 'CENTER',
        },
      ],
    });
  }

  buildCloseConfigSection() {
    const widgets: chatV1.Schema$GoogleAppsCardV1Widget[] = [
      {
        'selectionInput': {
          'type': 'DROPDOWN',
          'label': 'Allow to manually close poll',
          'name': 'type',
          'items': [
            {
              'text': 'Yes, but only creator',
              'value': '1',
              'selected': this.config.type === ClosableType.CLOSEABLE_BY_CREATOR,
            },
            {
              'text': 'Yes, anyone can close',
              'value': '2',
              'selected': this.config.type === ClosableType.CLOSEABLE_BY_ANYONE,
            },
            {
              'text': 'No, I want unclosable poll',
              'value': '0',
              'selected': this.config.type === ClosableType.UNCLOSEABLE,
            },
          ],
        },
        'horizontalAlignment': 'START',
      },
      {
        'decoratedText': {
          'topLabel': '',
          'text': 'Automatic close poll at certain time',
          'bottomLabel': 'The schedule time will show up',
          'switchControl': {
            'controlType': 'SWITCH',
            'name': 'is_autoclose',
            'value': '1',
            'selected': this.config.autoClose ?? false,
            'onChangeAction': {
              'function': 'new_poll_on_change',
              'parameters': [],
            },
          },
        },
      }];
    this.card.sections!.push({
      widgets,
    });
  }

  buildAutoCloseSection() {
    const widgets: chatV1.Schema$GoogleAppsCardV1Widget[] = [];
    const timezone = offsetToTimezone(this.timezone.offset);
    const nowMs = Date.now() + this.timezone.offset + 18000000;
    widgets.push(
      {
        'dateTimePicker': {
          'label': 'Close schedule time ' + timezone,
          'name': 'close_schedule_time',
          'type': 'DATE_AND_TIME',
          'valueMsEpoch': nowMs.toString(),
        },
      });

    widgets.push(
      {
        'decoratedText': {
          'text': 'Auto mention <b>@all</b> on 5 minutes before poll closed',
          'bottomLabel': 'This is to prevent other users to vote before the poll is closed',
          'switchControl': {
            'controlType': 'SWITCH',
            'name': 'auto_mention',
            'value': '1',
            'selected': this.config.autoMention ?? false,
          },
        },
      });
    this.card.sections!.push({
      widgets,
    });
  }

  buildMultipleVoteSection() {
    const widgets: chatV1.Schema$GoogleAppsCardV1Widget[] = [];

    const items = [
      {
        'text': 'No Limit',
        'value': '0',
        'selected': false,
      },
      {
        'text': '1',
        'value': '1',
        'selected': false,
      },
      {
        'text': '2',
        'value': '2',
        'selected': false,
      },
      {
        'text': '3',
        'value': '3',
        'selected': false,
      },
      {
        'text': '4',
        'value': '4',
        'selected': false,
      },
      {
        'text': '5',
        'value': '5',
        'selected': false,
      },
      {
        'text': '6',
        'value': '6',
        'selected': false,
      },
    ];
      // set selected item
    if (this.config.voteLimit !== undefined && items?.[this.config.voteLimit]) {
      items[this.config.voteLimit].selected = true;
    } else {
      items[1].selected = true;
    }
    widgets.push(
      {
        'selectionInput': {
          'type': 'DROPDOWN',
          'label': 'Vote Limit (Max options that can be voted)',
          'name': 'vote_limit',
          items,
        },
      });

    this.card.sections!.push({
      widgets,
    });
  }

  buildHelpText() {
    return {
      textParagraph: {
        text: 'Enter the poll topic and up to 10 choices in the poll. Blank options will be omitted.<br>' +
          'For scheduled auto close, the minimum time is 5 minutes after poll created.',
      },
    };
  }

  topicInput(topic: string) {
    return {
      textInput: {
        label: 'Topic',
        type: 'MULTIPLE_LINE',
        name: 'topic',
        value: topic,
      },
    };
  }

  optionInput(
    index: number, value: string): chatV1.Schema$GoogleAppsCardV1Widget {
    return {
      textInput: {
        label: `Option ${index + 1}`,
        type: 'SINGLE_LINE',
        name: `option${index}`,
        value: value || '',
      },
    };
  }

  buildFooter() {
    this.card.fixedFooter = {
      'primaryButton': createButton('Submit', 'start_poll'),
    };
  }
}
