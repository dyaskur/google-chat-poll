import BaseCard from './BaseCard';
import {ClosableType, PollForm} from '../helpers/interfaces';
import {MAX_NUM_OF_OPTIONS} from '../config/default';
import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';
import {offsetToTimezone} from '../helpers/time';

export default class NewPollFormCard extends BaseCard {
  private config: PollForm;
  private timezone: chatV1.Schema$TimeZone;

  constructor(config: PollForm, timezone: chatV1.Schema$TimeZone | undefined = undefined) {
    super();
    this.config = config;
    if (timezone?.offset) {
      this.timezone = timezone;
    } else {
      this.timezone = {offset: 0, id: 'GMT'};
    }
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
    const timezone = offsetToTimezone(this.timezone.offset!);
    const nowMs = Date.now() + this.timezone.offset! + 18000000;
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

  buildHelpText() {
    return {
      textParagraph: {
        text: 'Enter the poll topic and up to 10 choices in the poll. Blank options will be omitted.',
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
      'primaryButton': this.createButton('Submit', 'start_poll'),
    };
  }
}
