import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';
import BaseHandler from './BaseHandler';
import NewPollFormCard from '../cards/NewPollFormCard';
import {addOptionToState, getConfigFromInput, getStateFromCard} from '../helpers/state';
import {callMessageApi} from '../helpers/api';
import {createDialogActionResponse, createStatusActionResponse} from '../helpers/response';
import PollCard from '../cards/PollCard';
import {ClosableType, MessageDialogConfig, PollFormInputs, PollState, TaskEvent, Voter} from '../helpers/interfaces';
import AddOptionFormCard from '../cards/AddOptionFormCard';
import {saveVotes} from '../helpers/vote';
import {PROHIBITED_ICON_URL} from '../config/default';
import ClosePollFormCard from '../cards/ClosePollFormCard';
import MessageDialogCard from '../cards/MessageDialogCard';
import {createTask} from '../helpers/task';

/*
This list methods are used in the poll chat message
 */
interface PollAction {
  saveOption(): Promise<chatV1.Schema$Message>;

  getEventPollState(): PollState;
}

export default class ActionHandler extends BaseHandler implements PollAction {
  async process(): Promise<chatV1.Schema$Message> {
    const action = this.event.common?.invokedFunction;
    switch (action) {
      case 'start_poll':
        return await this.startPoll();
      case 'vote':
        return this.recordVote();
      case 'add_option_form':
        return this.addOptionForm();
      case 'add_option':
        return await this.saveOption();
      case 'show_form':
        const pollForm = new NewPollFormCard({topic: '', choices: []}, this.getUserTimezone()).create();
        return createDialogActionResponse(pollForm);
      case 'new_poll_on_change':
        return this.newPollOnChange();
      case 'close_poll_form':
        return this.closePollForm();
      case 'close_poll':
        return await this.closePoll();
      default:
        return createStatusActionResponse('Unknown action!', 'UNKNOWN');
    }
  }

  /**
   * Handle the custom start_poll action.
   *
   * @returns {object} Response to send back to Chat
   */
  async startPoll() {
    // Get the form values
    const formValues: PollFormInputs = this.event.common!.formInputs! as PollFormInputs;
    const config = getConfigFromInput(formValues);

    if (!config.topic || config.choices.length === 0) {
      // Incomplete form submitted, rerender
      const dialog = new NewPollFormCard(config, this.getUserTimezone()).create();
      return createDialogActionResponse(dialog);
    }
    if (config.closedTime) {
      // because previously we marked up the time with user timezone offset
      config.closedTime -= this.getUserTimezone()?.offset ?? 0;
    }
    const pollCardMessage = new PollCard({author: this.event.user, ...config}, this.getUserTimezone()).createMessage();
    const request = {
      parent: this.event.space?.name,
      requestBody: pollCardMessage,
    };
    const apiResponse = await callMessageApi('create', request);
    if (apiResponse.data?.name) {
      if (config.autoClose && config.closedTime) {
        const taskPayload: TaskEvent = {'id': apiResponse.data.name, 'action': 'close_poll', 'type': 'TASK'};
        await createTask(JSON.stringify(taskPayload), config.closedTime);
        if (config.autoMention) {
          const taskPayload: TaskEvent = {'id': apiResponse.data.name, 'action': 'remind_all', 'type': 'TASK'};
          await createTask(JSON.stringify(taskPayload), config.closedTime - 420000);
        }
      }
      return createStatusActionResponse('Poll started.', 'OK');
    } else {
      return createStatusActionResponse('Failed to start poll.', 'UNKNOWN');
    }
  }

  /**
   * Handle the custom vote action. Updates the state to record
   * the user's vote then rerenders the card.
   *
   * @returns {object} Response to send back to Chat
   */
  recordVote() {
    const parameters = this.event.common?.parameters;
    if (!(parameters?.['index'])) {
      throw new Error('Index Out of Bounds');
    }
    const choice = parseInt(parameters['index']);
    const userId = this.event.user?.name ?? '';
    const userName = this.event.user?.displayName ?? '';
    const voter: Voter = {uid: userId, name: userName};
    const state = this.getEventPollState();

    // Add or update the user's selected option
    state.votes = saveVotes(choice, voter, state.votes!, state.anon);
    const card = new PollCard(state, this.getUserTimezone());
    return {
      thread: this.event.message?.thread,
      actionResponse: {
        type: 'UPDATE_MESSAGE',
      },
      cardsV2: [card.createCardWithId()],
    };
  }

  /**
   * Opens and starts a dialog that allows users to add details about a contact.
   *
   * @returns {object} open a dialog.
   */
  addOptionForm() {
    const state = this.getEventPollState();
    const dialog = new AddOptionFormCard(state).create();
    return createDialogActionResponse(dialog);
  };

  /**
   * Handle add new option input to the poll state
   * the user's vote then rerenders the card.
   *
   * @returns {object} Response to send back to Chat
   */
  async saveOption(): Promise<chatV1.Schema$Message> {
    const userName = this.event.user?.displayName ?? '';
    const state = this.getEventPollState();
    const formValues = this.event.common?.formInputs;
    const optionValue = formValues?.['value']?.stringInputs?.value?.[0]?.trim() || '';
    addOptionToState(optionValue, state, userName);

    const cardMessage = new PollCard(state, this.getUserTimezone()).createMessage();

    const request = {
      name: this.event.message!.name,
      requestBody: cardMessage,
      updateMask: 'cardsV2',
    };
    const apiResponse = await callMessageApi('update', request);
    if (apiResponse.status === 200) {
      return createStatusActionResponse('Option is added', 'OK');
    } else {
      return createStatusActionResponse('Failed to add option.', 'UNKNOWN');
    }
  }

  getEventPollState(): PollState {
    const stateJson = getStateFromCard(this.event);
    if (!stateJson) {
      throw new ReferenceError('no valid state in the event');
    }
    return JSON.parse(stateJson);
  }

  async closePoll(): Promise<chatV1.Schema$Message> {
    const state = this.getEventPollState();
    state.closedTime = Date.now();
    state.closedBy = this.event.user?.displayName ?? '';
    const cardMessage = new PollCard(state, this.getUserTimezone()).createMessage();
    const request = {
      name: this.event.message!.name,
      requestBody: cardMessage,
      updateMask: 'cardsV2',
    };
    const apiResponse = await callMessageApi('update', request);
    if (apiResponse.status === 200) {
      return createStatusActionResponse('Poll is closed', 'OK');
    } else {
      return createStatusActionResponse('Failed to close poll.', 'UNKNOWN');
    }
  }

  closePollForm() {
    const state = this.getEventPollState();
    if (state.type === ClosableType.CLOSEABLE_BY_ANYONE || state.author!.name === this.event.user?.name) {
      return createDialogActionResponse(new ClosePollFormCard().create());
    }

    const dialogConfig: MessageDialogConfig = {
      title: 'Sorry, you can not close this poll',
      message: `The poll setting restricts the ability to close the poll to only the creator(${state.author!.displayName}).`,
      imageUrl: PROHIBITED_ICON_URL,
    };
    return createDialogActionResponse(new MessageDialogCard(dialogConfig).create());
  }

  newPollOnChange() {
    const formValues: PollFormInputs = this.event.common!.formInputs! as PollFormInputs;
    const config = getConfigFromInput(formValues);
    return createDialogActionResponse(new NewPollFormCard(config, this.getUserTimezone()).create());
  }
}
