import {PollState, TaskEvent} from '../helpers/interfaces';
import {callMessageApi} from '../helpers/api';
import {getStateFromCardName} from '../helpers/state';
import PollCard from '../cards/PollCard';

export default class TaskHandler {
  event: TaskEvent;

  public constructor(event: TaskEvent) {
    this.event = event;
  }

  async process(): Promise<void> {
    this.event.state = await this.getStateFromMessageId();
    switch (this.event.action) {
      case 'close_poll':
        if (this.event.state.closedBy) {
          console.log('the poll is already closed by ', this.event.state.closedBy);
          return;
        }
        if (!this.event.state.closedTime || this.event.state.closedTime > Date.now()) {
          this.event.state.closedTime = Date.now();
        }
        this.event.state.closedBy = 'scheduled auto-close';
        const apiResponse = await this.updatePollMessage(this.event.state);
        if (apiResponse?.status !== 200) {
          throw new Error('Error when closing message');
        }
        break;
      case 'remind_all':
        if (this.event.state.closedTime && this.event.state.closedTime > Date.now()) {
          await this.remindAll();
        }
        break;
      default:
        console.log('unknown task');
    }
  }

  async getStateFromMessageId(): Promise<PollState> {
    const request = {
      name: this.event.id,
    };
    const apiResponse = await callMessageApi('get', request);
    const currentState = getStateFromCardName(apiResponse.data!.cardsV2?.[0].card ?? {});
    if (!currentState) {
      throw new Error('State not found');
    }
    this.event.space = apiResponse.data!.space;
    this.event.thread = apiResponse.data!.thread;
    return JSON.parse(currentState) as PollState;
  }

  async updatePollMessage(currentState: PollState) {
    const localeTimezone = {locale: 'en', offset: 0, id: 'UTC'};
    const cardMessage = new PollCard(currentState, localeTimezone).createMessage();
    const request = {
      name: this.event.id,
      requestBody: cardMessage,
      updateMask: 'cardsV2',
    };
    return await callMessageApi('update', request);
  }

  async remindAll() {
    const text = `<users/all>, The poll with the topic *${this.event.state!.topic}*  is reaching its finale. Please wrap up your voting now.`;

    const request = {
      name: this.event.id,
      parent: this.event.space!.name,
      messageReplyOption: 'REPLY_MESSAGE_FALLBACK_TO_NEW_THREAD',
      requestBody: {
        text, thread: this.event.thread,
      },
    };
    return await callMessageApi('create', request);
  }
}
