import {
  buildConfigurationForm,
  buildOptionsFromMessage,
} from './src/config-form.js';
import {buildVoteCard} from './src/vote-card.js';
import {saveVotes} from './src/helpers/vote.js';
import {buildAddOptionForm} from './src/add-option-form.js';
import {callMessageApi} from './src/helpers/api.js';
import {addOptionToState} from './src/helpers/option.js';
import {buildActionResponse} from './src/helpers/response.js';
import {MAX_NUM_OF_OPTIONS} from './src/config/default.js';
import {splitMessage} from './src/helpers/utils.js';

/**
 * App entry point.
 * @param {object} req - chat event
 * @param {object} res - chat event
 * @returns {void}
 */
export async function app(req, res) {
  if (!(req.method === 'POST' && req.body)) {
    res.status(400).send('');
  }
  const buttonCard = {
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
      event.common?.invokedFunction || event.message?.slashCommand?.commandId ||
      event.message?.argumentText,
      event.user.displayName, event.user.email, event.space.type,
      event.space.name);
  let reply = {};
  // Dispatch slash and action events
  if (event.type === 'MESSAGE') {
    const message = event.message;
    if (message.slashCommand?.commandId === '1') {
      reply = showConfigurationForm(event);
    } else if (message.slashCommand?.commandId === '2') {
      reply = {
        thread: event.message.thread,
        actionResponse: {
          type: 'NEW_MESSAGE',
        },
        text: 'Hi there! I can help you create polls to enhance collaboration and efficiency ' +
            'in decision-making using Google Chat™.\n' +
            '\n' +
            'Below is an example commands:\n' +
            '`/poll` - You will need to fill out the topic and answers in the form that will be displayed.\n' +
            '`/poll "Which is the best country to visit" "Indonesia"` - to create a poll with ' +
            '"Which is the best country to visit" as the topic and "Indonesia" as the answer\n' +
            '\n' +
            'We hope you find our service useful and please don\'t hesitate to contact us ' +
            'if you have any questions or concerns.',
      };
    } else if (message.text) {
      const argument = event.message?.argumentText?.trim().toLowerCase();

      reply = {
        thread: event.message.thread,
        actionResponse: {
          type: 'NEW_MESSAGE',
        },
        text: 'Hi! To create a poll, you can use the */poll* command. \n \n' +
            'Alternatively, you can create poll by mentioning me with question and answers. ' +
            'e.g *@Absolute Poll "Your Question" "Answer 1" "Answer 2"*',
      };
      const choices = splitMessage(argument);
      if (choices.length > 2) {
        const pollCard = buildVoteCard({
          topic: choices.shift(),
          author: event.user,
          choices: choices,
          votes: {},
          anon: false,
          optionable: true,
        });
        const message = {
          cardsV2: [pollCard],
        };
        reply = {
          thread: event.message.thread,
          actionResponse: {
            type: 'NEW_MESSAGE',
          },
          ...message,
        };
      }

      if (argument === 'help') {
        reply.text = 'Hi there! I can help you create polls to enhance collaboration and efficiency ' +
            'in decision-making using Google Chat™.\n' +
            '\n' +
            'Below is an example commands:\n' +
            '`/poll` - You will need to fill out the topic and answers in the form that will be displayed.\n' +
            '`/poll "Which is the best country to visit" "Indonesia"` - to create a poll with ' +
            '"Which is the best country to visit" as the topic and "Indonesia" as the answer\n' +
            '\n' +
            'We hope you find our service useful and please don\'t hesitate to contact us ' +
            'if you have any questions or concerns.';
        // reply.cardsV2 = buttonCard;
      } else if (argument === 'test') {
        reply.text = 'test search on <a href=\'http://www.google.com\'>google</a> (https://google.com)[https://google.com]';
      }
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
      reply = showConfigurationForm(event, true);
    }
  } else if (event.type === 'ADDED_TO_SPACE') {
    const message = {};
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

    message.cardsV2 = buttonCard;

    reply = {
      actionResponse: {
        type: 'NEW_MESSAGE',
      },
      ...message,
    };
  }
  res.json(reply);
}

/**
 * Handles the slash command to display the config form.
 *
 * @param {object} event - chat event
 * @param {boolean} isBlank - fill with text from message or note
 * @returns {object} Response to send back to Chat
 */
function showConfigurationForm(event, isBlank = false) {
  // Seed the topic with any text after the slash command
  const message = isBlank ? '' : event.message?.argumentText?.trim();
  const options = buildOptionsFromMessage(message);
  const dialog = buildConfigurationForm(options);
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

/**
 * Handle the custom start_poll action.
 *
 * @param {object} event - chat event
 * @returns {object} Response to send back to Chat
 */
async function startPoll(event) {
  // Get the form values
  const formValues = event.common?.formInputs;
  const topic = formValues?.['topic']?.stringInputs.value[0]?.trim();
  const isAnonymous = formValues?.['is_anonymous']?.stringInputs.value[0] ===
      '1';
  const allowAddOption = formValues?.['allow_add_option']?.stringInputs.value[0] ===
      '1';
  const choices = [];
  const votes = {};

  for (let i = 0; i < MAX_NUM_OF_OPTIONS; ++i) {
    const choice = formValues?.[`option${i}`]?.stringInputs.value[0]?.trim();
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

  // Valid configuration, build the voting card to display
  // in the space
  const pollCard = buildVoteCard({
    topic: topic,
    author: event.user,
    choices: choices,
    votes: votes,
    anon: isAnonymous,
    optionable: allowAddOption,
  });
  const message = {
    cardsV2: [pollCard],
  };
  const request = {
    parent: event.space.name,
    requestBody: message,
  };
  const apiResponse = await callMessageApi('create', request);
  if (apiResponse) {
    return buildActionResponse('Poll started.', 'OK');
  } else {
    return buildActionResponse('Failed to start poll.', 'UNKNOWN');
  }
}

/**
 * Handle the custom vote action. Updates the state to record
 * the user's vote then rerenders the card.
 *
 * @param {object} event - chat event
 * @returns {object} Response to send back to Chat
 */
function recordVote(event) {
  const parameters = event.common?.parameters;

  const choice = parseInt(parameters['index']);
  const userId = event.user.name;
  const userName = event.user.displayName;
  const voter = {uid: userId, name: userName};
  const state = JSON.parse(parameters['state']);

  // Add or update the user's selected option
  state.votes = saveVotes(choice, voter, state.votes, state.anon);

  const card = buildVoteCard(state);
  return {
    thread: event.message.thread,
    actionResponse: {
      type: 'UPDATE_MESSAGE',
    },
    cardsV2: [card],
  };
}

/**
 * Opens and starts a dialog that allows users to add details about a contact.
 *
 * @param {object} event the event object from Google Chat.
 *
 * @returns {object} open a dialog.
 */
function addOptionForm(event) {
  const card = event.message.cardsV2[0].card;
  const stateJson = card.sections[0].widgets[0].decoratedText?.button?.onClick?.action?.parameters[0].value ||
      card.sections[1].widgets[0].decoratedText?.button?.onClick?.action?.parameters[0].value;
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
 * @param {object} event - chat event
 * @returns {object} Response to send back to Chat
 */
async function saveOption(event) {
  const userName = event.user.displayName;

  const parameters = event.common?.parameters;
  const state = JSON.parse(parameters['state']);
  const formValues = event.common?.formInputs;
  const optionValue = formValues?.['value']?.stringInputs.value[0]?.trim();
  addOptionToState(optionValue, state, userName);

  const card = buildVoteCard(state);
  const message = {
    cardsV2: [card],
  };
  const request = {
    name: event.message.name,
    requestBody: message,
    updateMask: 'cardsV2',
  };
  const apiResponse = await callMessageApi('update', request);
  if (apiResponse) {
    return buildActionResponse('Option is added', 'OK');
  } else {
    return buildActionResponse('Failed to add option.', 'UNKNOWN');
  }
}
