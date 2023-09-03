import {PollState, taskEvent} from '../helpers/interfaces';
import {callMessageApi} from '../helpers/api';
import {getStateFromCardName} from '../helpers/state';
import PollCard from '../cards/PollCard';

export default class TaskHandler {
  event: taskEvent;

  public constructor(event: taskEvent) {
    this.event = event;
  }

  async process(): Promise<void> {
    switch (this.event.action) {
      case 'close_poll':
        const currentState = await this.getStateFromMessageId();
        if (!currentState.closedTime || currentState.closedTime > Date.now()) {
          currentState.closedTime = Date.now();
        }
        currentState.closedBy = 'scheduled auto-close';
        const apiResponse = await this.updatePollMessage(currentState);
        if (apiResponse?.status !== 200) {
          throw new Error('Error when closing message');
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
}
