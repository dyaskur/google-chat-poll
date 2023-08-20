import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';
import BaseHandler from './BaseHandler';
import NewPollFormCard from '../cards/NewPollFormCard';
import {addOptionToState} from '../helpers/option';
import {callMessageApi} from '../helpers/api';
import {createDialogActionResponse, createStatusActionResponse} from '../helpers/response';
import PollCard from '../cards/PollCard';
import {PollState, Voter, Votes} from '../helpers/interfaces';
import AddOptionFormCard from '../cards/AddOptionFormCard';
import {saveVotes} from '../helpers/vote';
import {MAX_NUM_OF_OPTIONS} from '../config/default';

/*
This list methods are used in the poll chat message
 */
interface PollAction {
  saveOption(): Promise<chatV1.Schema$Message>;

  getEventPollState(): PollState;
}

export default class ActionHandler extends BaseHandler implements PollAction {
  constructor(event: chatV1.Schema$DeprecatedEvent) {
    super(event);
  }

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
        return {
          actionResponse: {
            type: 'DIALOG',
            dialogAction: {
              dialog: {
                body: new NewPollFormCard({topic: '', choices: []}).create(),
              },
            },
          },
        };
      default:
        return createStatusActionResponse('Unknown action!', 'UNKNOWN');
    }
  }

  /**
   * Handle the custom start_poll action.
   *
   * @param {object} chatV1.Schema$DeprecatedEvent - chat event
   * @returns {object} Response to send back to Chat
   */
  async startPoll() {
    // Get the form values
    const formValues = this.event.common?.formInputs;
    const topic = formValues?.['topic']?.stringInputs?.value?.[0]?.trim() ?? '';
    const isAnonymous = formValues?.['is_anonymous']?.stringInputs?.value?.[0] === '1';
    const allowAddOption = formValues?.['allow_add_option']?.stringInputs?.value?.[0] === '1';
    const choices = [];
    const votes: Votes = {};

    for (let i = 0; i < MAX_NUM_OF_OPTIONS; ++i) {
      const choice = formValues?.[`option${i}`]?.stringInputs?.value?.[0]?.trim();
      if (choice) {
        choices.push(choice);
        votes[i] = [];
      }
    }

    if (!topic || choices.length === 0) {
      // Incomplete form submitted, rerender
      const dialog = new NewPollFormCard({
        topic,
        choices,
      }).create();
      return {
        actionResponse: {
          type: 'DIALOG',
          dialogAction: {
            dialog: {
              body: dialog,
            },
          },
        },
      };
    }
    const pollCard = new PollCard({
      topic: topic, choiceCreator: undefined,
      author: this.event.user,
      choices: choices,
      votes: votes,
      anon: isAnonymous,
      optionable: allowAddOption,
    }).createCardWithId();
    // Valid configuration, make the voting card to display in the space
    const message = {
      cardsV2: [pollCard],
    };
    const request = {
      parent: this.event.space?.name,
      requestBody: message,
    };
    const apiResponse = await callMessageApi('create', request);
    if (apiResponse) {
      return createStatusActionResponse('Poll started.', 'OK');
    } else {
      return createStatusActionResponse('Failed to start poll.', 'UNKNOWN');
    }
  }

  /**
   * Handle the custom vote action. Updates the state to record
   * the user's vote then rerenders the card.
   *
   * @param {object} event - chat event
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
    const state = JSON.parse(parameters['state']);

    // Add or update the user's selected option
    state.votes = saveVotes(choice, voter, state.votes, state.anon);
    const card = new PollCard(state);
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
   * @param {object} event the event object from Google Chat.
   *
   * @returns {object} open a dialog.
   */
  addOptionForm() {
    const card = this.event.message!.cardsV2?.[0]?.card;
    // @ts-ignore: because too long
    const stateJson = (card.sections[0].widgets[0].decoratedText?.button?.onClick?.action?.parameters[0].value || card.sections[1].widgets[0].decoratedText?.button?.onClick?.action?.parameters[0].value) ?? '';
    const state = JSON.parse(stateJson);
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

    const cardMessage = new PollCard(state).createMessage();

    const request = {
      name: this.event.message!.name,
      requestBody: cardMessage,
      updateMask: 'cardsV2',
    };
    const apiResponse = await callMessageApi('update', request);
    if (apiResponse) {
      return createStatusActionResponse('Option is added', 'OK');
    } else {
      return createStatusActionResponse('Failed to add option.', 'UNKNOWN');
    }
  }

  getEventPollState(): PollState {
    const parameters = this.event.common?.parameters;
    const state = parameters?.['state'];
    if (!state) {
      throw new ReferenceError('no valid state in the event');
    }
    return JSON.parse(state);
  }
}
