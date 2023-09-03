import {PollState, taskEvent} from '../helpers/interfaces';
import {callMessageApi} from '../helpers/api';
import {getStateFromCardName} from '../helpers/state';
import PollCard from '../cards/PollCard';

export default class TaskHandler {
  event: taskEvent;

  public constructor(event: taskEvent) {
    this.event = event;
  }

  async process() {
    switch (this.event.action) {
      case 'close_poll':
        const currentState = await this.getStateFromMessageId();
        if (!currentState.closedTime || currentState.closedTime > Date.now()) {
          currentState.closedTime = Date.now();
        }
        const cardMessage = new PollCard(currentState).createMessage();
        const request = {
          name: this.event.id,
          requestBody: cardMessage,
          updateMask: 'cardsV2',
        };
        const apiResponse = await callMessageApi('update', request);
        if (apiResponse?.status === 200) {
          console.log('message is closed by autoclose system');
        } else {
          console.log('message is closed by autoclose system');
          throw new Error('Error when closing message');
        }
      default:
        return {};
    }
  }

  async getStateFromMessageId(): Promise<PollState> {
    const request = {
      name: this.event.id,
    };
    const apiResponse = await callMessageApi('get', request);
    console.log('task getting message', JSON.stringify(apiResponse));
    if (apiResponse) {
      const currentState = getStateFromCardName(apiResponse.data?.cardsV2?.[0].card ?? {});
      console.log('task getting state', JSON.stringify(currentState));
      if (!currentState) {
        throw new Error('State not found');
      }
      return JSON.parse(currentState) as PollState;
    } else {
      throw new Error('Error when getting message detail');
    }
  }
}
