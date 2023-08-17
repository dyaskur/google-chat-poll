import {HttpFunction} from '@google-cloud/functions-framework/build/src/functions';

import {
  buildConfigurationForm,
} from './config-form';
import {buildVoteCard} from './vote-card';
import {saveVotes} from './helpers/vote';
import {buildAddOptionForm} from './add-option-form';
import {callMessageApi} from './helpers/api';
import {addOptionToState} from './helpers/option';
import {buildActionResponseStatus} from './helpers/response';
import {MAX_NUM_OF_OPTIONS} from './config/default';
import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';
import {Voter, Votes} from './helpers/interfaces';
import {PollCard} from './cards/PollCard';
import {CommandHandler} from './handlers/CommandHandler';
import {MessageHandler} from './handlers/MessageHandler';

export const app: HttpFunction = async (req, res) => {
  if (!(req.method === 'POST' && req.body)) {
    res.status(400).send('');
  }
  const buttonCard: chatV1.Schema$CardWithId = {
    'cardId': 'welcome-card',
    'card': {
      'sections': [
        {
          'widgets': [
            {
              'buttonList': {
                'buttons': [
                  {
                    'text': 'Create Poll',
                    'onClick': {
                      'action': {
                        'function': 'show_form',
                        'interaction': 'OPEN_DIALOG',
                        'parameters': [],
                      },
                    },
                  },
                  {
                    'text': 'Terms and Conditions',
                    'onClick': {
                      'openLink': {
                        'url': 'https://absolute-poll.yaskur.com/terms-and-condition',
                      },
                    },
                  },
                  {
                    'text': 'Contact Us',
                    'onClick': {
                      'openLink': {
                        'url': 'https://absolute-poll.yaskur.com/contact-us',
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  };
  const event = req.body;
  console.log(event.type,
    event.common?.invokedFunction || event.message?.slashCommand?.commandId || event.message?.argumentText,
    event.user.displayName, event.user.email, event.space.type, event.space.name);
  // console.log(JSON.stringify(event.message.cardsV2));
  console.log(JSON.stringify(event.message));
  console.log(JSON.stringify(event.user));
  let reply: chatV1.Schema$Message = {
    thread: event.message.thread,
    actionResponse: {
      type: 'NEW_MESSAGE',
    },
    text: 'Hi! To create a poll, you can use the */poll* command. \n \n' +
      'Alternatively, you can create poll by mentioning me with question and answers. ' +
      'e.g *@Absolute Poll "Your Question" "Answer 1" "Answer 2"*',
  };
  // Dispatch slash and action events
  if (event.type === 'MESSAGE') {
    const message = event.message;
    if (message.slashCommand?.commandId) {
      reply = new CommandHandler(event).process();
    } else if (message.text) {
      reply = new MessageHandler(event).process();
    }
  } else if (event.type === 'CARD_CLICKED') {
    const action = event.common?.invokedFunction;
    if (action === 'start_poll') {
      reply = await startPoll(event);
    } else if (action === 'vote') {
      reply = recordVote(event);
    } else if (action === 'add_option_form') {
      reply = addOptionForm(event);
    } else if (action === 'add_option') {
      reply = await saveOption(event);
    } else if (action === 'show_form') {
      // todo: show form using new card generator
    }
  } else if (event.type === 'ADDED_TO_SPACE') {
    const message: chatV1.Schema$Message = {
      text: undefined,
      cardsV2: undefined,
    };
    const spaceType = event.space.type;
    if (spaceType === 'ROOM') {
      message.text = 'Hi there! I\'d be happy to assist you in creating polls to improve collaboration and ' +
        'decision-making efficiency on Google Chat™.\n' +
        '\n' +
        'To create a poll, simply use the */poll* command or click on the "Create Poll" button below. ' +
        'You can also test our app in a direct message if you prefer.\n' +
        '\n' +
        'Alternatively, you can ' +
        'You can also test our app in a direct message if you prefer.\n' +
        '\n' +
        'We hope you find our service useful and please don\'t hesitate to contact us ' +
        'if you have any questions or concerns.';
    } else if (spaceType === 'DM') {
      message.text = 'Hey there! ' +
        'Before creating a poll in a group space, you can test it out here in a direct message.\n' +
        '\n' +
        'To create a poll, you can use the */poll* command or click on the "Create Poll" button below.\n' +
        '\n' +
        'Thank you for using our bot. We hope that it will prove to be a valuable tool for you and your team.\n' +
        '\n' +
        'Don\'t hesitate to reach out if you have any questions or concerns in the future.' +
        ' We are always here to help you and your team';
    }

    message.cardsV2 = [buttonCard];

    reply = {
      actionResponse: {
        type: 'NEW_MESSAGE',
      },
      ...message,
    };
  }
  res.json(reply);
};


/**
 * Handle the custom start_poll action.
 *
 * @param {object} event - chat event
 * @returns {object} Response to send back to Chat
 */
async function startPoll(event: chatV1.Schema$DeprecatedEvent) {
  // Get the form values
  const formValues = event.common?.formInputs;
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
    const dialog = buildConfigurationForm({
      topic,
      choices,
    });
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
    author: event.user,
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
    parent: event.space?.name,
    requestBody: message,
  };
  const apiResponse = await callMessageApi('create', request);
  if (apiResponse) {
    return buildActionResponseStatus('Poll started.', 'OK');
  } else {
    return buildActionResponseStatus('Failed to start poll.', 'UNKNOWN');
  }
}

/**
 * Handle the custom vote action. Updates the state to record
 * the user's vote then rerenders the card.
 *
 * @param {object} event - chat event
 * @returns {object} Response to send back to Chat
 */
function recordVote(event: chatV1.Schema$DeprecatedEvent) {
  const parameters = event.common?.parameters;
  if (!(parameters?.['index'])) {
    throw new Error('Index Out of Bounds');
  }
  const choice = parseInt(parameters['index']);
  const userId = event.user?.name ?? '';
  const userName = event.user?.displayName ?? '';
  const voter: Voter = {uid: userId, name: userName};
  const state = JSON.parse(parameters['state']);

  // Add or update the user's selected option
  state.votes = saveVotes(choice, voter, state.votes, state.anon);

  const card = new PollCard(state);
  return {
    thread: event.message?.thread,
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
function addOptionForm(event: chatV1.Schema$DeprecatedEvent) {
  const card = event.message!.cardsV2?.[0]?.card;
  // @ts-ignore: because too long
  const stateJson = (card.sections[0].widgets[0].decoratedText?.button?.onClick?.action?.parameters[0].value || card.sections[1].widgets[0].decoratedText?.button?.onClick?.action?.parameters[0].value) ?? '';
  const state = JSON.parse(stateJson);
  const dialog = buildAddOptionForm(state);
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
;

/**
 * Handle the custom vote action. Updates the state to record
 * the user's vote then rerenders the card.
 *
 * @param {chatV1.Schema$DeprecatedEvent} event - chat event
 * @returns {object} Response to send back to Chat
 */
async function saveOption(event: chatV1.Schema$DeprecatedEvent) {
  const userName = event.user?.displayName ?? '';
  const state = getEventPollState(event);
  const formValues = event.common?.formInputs;
  const optionValue = formValues?.['value']?.stringInputs?.value?.[0]?.trim() || '';
  addOptionToState(optionValue, state, userName);

  const card = buildVoteCard(state);
  const message = {
    cardsV2: [card],
  };
  const request = {
    name: event.message!.name,
    requestBody: message,
    updateMask: 'cardsV2',
  };
  const apiResponse = await callMessageApi('update', request);
  if (apiResponse) {
    return buildActionResponseStatus('Option is added', 'OK');
  } else {
    return buildActionResponseStatus('Failed to add option.', 'UNKNOWN');
  }
}

function getEventPollState(event: chatV1.Schema$DeprecatedEvent) {
  const parameters = event.common?.parameters;
  const state = parameters?.['state'];
  if (!state) {
    throw new ReferenceError('no valid state in the event');
  }
  return JSON.parse(state);
}
