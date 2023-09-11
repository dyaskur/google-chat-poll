import BaseCard from './BaseCard';
import {chat_v1 as chatV1} from '@googleapis/chat';
import {LocaleTimezone, PollState} from '../helpers/interfaces';
import {generateHelperWidget} from '../helpers/helper';

export default class ClosePollFormCard extends BaseCard {
  id = 'close_poll_form';
  state: PollState;
  timezone: LocaleTimezone;

  constructor(config: PollState, timezone: LocaleTimezone) {
    super();
    this.state = config;
    this.timezone = timezone;
  }

  create(): chatV1.Schema$GoogleAppsCardV1Card {
    this.buildHeader();
    if (this.state.closedTime) {
      this.buildCurrentScheduleInfo();
    }
    this.buildButtons();
    this.buildSections();
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

  buildCurrentScheduleInfo() {
    const locale = this.timezone.locale;
    const closedDate = new Date(this.state.closedTime!).toLocaleString(locale, {timeZone: this.timezone.id});
    this.card.sections!.push(
      {
        'widgets': [
          {
            'decoratedText': {
              'text': `<i>This poll already has Auto Close schedule at <time> ${closedDate}</time>(${this.timezone.id}) </i>`,
              'startIcon': {
                'knownIcon': 'CLOCK',
                'altText': '@',
              },
            },
          },
        ],
      });
  }

  buildButtons() {
    let scheduleButtonText = 'Create Schedule Close';
    if (this.state.closedTime) {
      scheduleButtonText = 'Edit Schedule Close';
    }

    this.addSectionWidget({
      'buttonList': {
        'buttons': [
          this.createButton(scheduleButtonText, 'schedule_close_poll_form'),
          this.createButton('Close Now', 'close_poll'),
        ],
      },
    });
  }

  buildSections() {
    this.card.sections!.push(generateHelperWidget());
  }
}
