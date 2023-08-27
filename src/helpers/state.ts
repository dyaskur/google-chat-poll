import {ClosableType, PollConfig, PollFormInputs, PollState} from './interfaces';
import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';
import {MAX_NUM_OF_OPTIONS} from '../config/default';

/**
 * Add a new option to the state(like DB)
 *
 * @param {string} option - the new option name
 * @param {object} state - the current message state
 * @param {string} creator - who add the new option
 * @returns {void} card
 */
export function addOptionToState(option: string, state: PollState, creator = '') {
  const choiceLength = state.choices.length;
  state.choices.push(option);
  if (state.choiceCreator === undefined) {
    state.choiceCreator = {[choiceLength]: creator};
  } else {
    state.choiceCreator[choiceLength] = creator;
  }
}

export function getStateFromCard(event: chatV1.Schema$DeprecatedEvent) {
  const card = event.message?.cardsV2?.[0]?.card as chatV1.Schema$GoogleAppsCardV1Card;
  return getStateFromCardName(card) || getStateFromParameter(event) || getStateFromCardWhenNoHeader(card) ||
    getStateFromCardWhenHasHeader(card);
}

export function getConfigFromInput(formValues: PollFormInputs) {
  const state: PollConfig = {topic: '', choices: []};
  state.topic = formValues.topic.stringInputs!.value![0]!.trim() ?? '';
  state.anon = formValues.is_anonymous?.stringInputs!.value![0] === '1';
  state.optionable = formValues.allow_add_option?.stringInputs!.value![0] === '1';
  state.type = parseInt(formValues.type?.stringInputs!.value![0] ?? '1') as ClosableType;

  for (let i = 0; i < MAX_NUM_OF_OPTIONS; ++i) {
    const choice = formValues[`option${i}`]?.stringInputs!.value![0]!.trim();
    if (choice) {
      state.choices.push(choice);
    }
  }
  return state;
}

function getStateFromCardWhenNoHeader(card: chatV1.Schema$GoogleAppsCardV1Card) {
  return card?.sections?.[0].widgets?.[0].decoratedText?.button?.onClick?.action?.parameters?.[0]?.value;
}

function getStateFromCardWhenHasHeader(card: chatV1.Schema$GoogleAppsCardV1Card) {
  // when has header the first section is header
  return card?.sections?.[1].widgets?.[0].decoratedText?.button?.onClick?.action?.parameters?.[0]?.value;
}

function getStateFromCardName(card: chatV1.Schema$GoogleAppsCardV1Card) {
  // when has header the first section is header
  return card?.name;
}

function getStateFromParameter(event: chatV1.Schema$DeprecatedEvent) {
  const parameters = event.common?.parameters;

  return parameters?.['state'];
}
