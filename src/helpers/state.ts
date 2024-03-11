import {ClosableType, PollForm, PollFormInputs, PollState} from './interfaces';
import {chat_v1 as chatV1} from '@googleapis/chat';
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
  if (!card) {
    throw new ReferenceError('no valid card in the event');
  }
  return getStateFromCardName(card) || getStateFromParameter(event) || getStateFromCardWhenNoHeader(card) ||
    getStateFromCardWhenHasHeader(card);
}

function getChoicesFromInput(formValues: PollFormInputs) {
  const choices = [];
  for (let i = 0; i < MAX_NUM_OF_OPTIONS; ++i) {
    const choice = formValues[`option${i}`]?.stringInputs!.value![0]!.trim();
    if (choice) {
      choices.push(choice);
    }
  }
  return choices;
}

function getStringInputValue(input: chatV1.Schema$Inputs) {
  if (!input) {
    return '';
  }
  return input.stringInputs!.value![0];
}

export function getConfigFromInput(formValues: PollFormInputs) {
  const state: PollForm = {topic: '', choices: []};
  state.topic = getStringInputValue(formValues.topic).trim() ?? '';
  state.anon = getStringInputValue(formValues.is_anonymous) === '1';
  state.optionable = getStringInputValue(formValues.allow_add_option) === '1';
  state.type = parseInt(getStringInputValue(formValues.type) || '1') as ClosableType;
  state.autoClose = getStringInputValue(formValues.is_autoclose) === '1';
  state.autoMention = getStringInputValue(formValues.auto_mention) === '1';
  state.closedTime = parseInt(formValues.close_schedule_time?.dateTimeInput!.msSinceEpoch ?? '0');
  state.choices = getChoicesFromInput(formValues);
  state.voteLimit = parseInt(getStringInputValue(formValues.vote_limit) || '1');
  return state;
}

function getStateFromCardWhenNoHeader(card: chatV1.Schema$GoogleAppsCardV1Card) {
  return card.sections?.[0].widgets?.[0].decoratedText?.button?.onClick?.action?.parameters?.[0]?.value;
}

function getStateFromCardWhenHasHeader(card: chatV1.Schema$GoogleAppsCardV1Card) {
  // when has header the first section is header
  return card.sections?.[1].widgets?.[0].decoratedText?.button?.onClick?.action?.parameters?.[0]?.value;
}

export function getStateFromCardName(card: chatV1.Schema$GoogleAppsCardV1Card) {
  // when has header the first section is header
  return card.name;
}

function getStateFromParameter(event: chatV1.Schema$DeprecatedEvent) {
  const parameters = event.common?.parameters;

  return parameters?.['state'];
}
