import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';
import {offsetToTimezone} from '../helpers/time';
import ClosePollFormCard from './ClosePollFormCard';

export default class ScheduleClosePollFormCard extends ClosePollFormCard {
  create(): chatV1.Schema$GoogleAppsCardV1Card {
    this.buildHeader();
    if (this.state.closedTime) {
      this.buildCurrentScheduleInfo();
    }
    this.buildAutoCloseSection();
    this.buildButtons();
    this.buildSections();
    return this.card;
  }

  buildHeader() {
    this.card.header = {
      'title': 'Schedule Close Poll',
      'subtitle': 'You can schedule the poll to close here.',
      'imageUrl': '',
      'imageType': 'CIRCLE',
    };
  }

  buildButtons() {
    let scheduleButtonText = 'Create Schedule Close';
    if (this.state.closedTime) {
      scheduleButtonText = 'Edit Schedule Close';
    }

    this.addSectionWidget({
      'buttonList': {
        'buttons': [this.createButton(scheduleButtonText, 'schedule_close_poll')],
      },
    });
  }

  buildAutoCloseSection() {
    const widgets: chatV1.Schema$GoogleAppsCardV1Widget[] = [];
    const timezone = offsetToTimezone(this.timezone.offset!);
    let scheduleTime = Date.now() + 18000000;
    if (this.state.closedTime) {
      scheduleTime = this.state.closedTime;
    }
    scheduleTime += this.timezone.offset!;
    widgets.push(
      {
        'dateTimePicker': {
          'label': 'Close schedule time ' + timezone,
          'name': 'close_schedule_time',
          'type': 'DATE_AND_TIME',
          'valueMsEpoch': scheduleTime.toString(),
        },
      });

    widgets.push(
      {
        'decoratedText': {
          'text': 'Auto mention <b>@all</b> on 5 minutes before poll closed',
          'bottomLabel': 'This is to ensure that other users do not forget to vote before the poll is closed.',
          'switchControl': {
            'controlType': 'SWITCH',
            'name': 'auto_mention',
            'value': '1',
            'selected': true,
          },
        },
      });
    this.card.sections!.push({
      widgets,
    });
  }
}
