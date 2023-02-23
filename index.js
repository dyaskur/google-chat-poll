const {buildConfigurationForm, MAX_NUM_OF_OPTIONS} = require('./src/config-form');
const {buildVoteCard} = require('./src/vote-card');
const {saveVotes} = require('./src/helpers/vote');
const {buildAddOptionForm} = require('./src/add-option-form');
const {callMessageApi} = require('./src/helpers/api');
const {addOptionToState} = require('./src/helpers/option');
const {buildActionResponse} = require('./src/helpers/response');

/**
 * App entry point.
 * @param {object} req - chat event
 * @param {object} res - chat event
 * @returns {void}
 */
exports.app = async (req, res) => {
  if (!(req.method === 'POST' && req.body)) {
    res.status(400).send('');
  }
  console.log('the request body:', JSON.stringify(req.body));
  const event = req.body;
  let reply = {};
  // Dispatch slash and action events
  if (event.type === 'MESSAGE') {
    const message = event.message;
    if (message.slashCommand?.commandId === '1') {
      reply = showConfigurationForm(event);
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
    }
  }
  console.log('the response body', JSON.stringify(reply));
  res.json(reply);
};

/**
 * Handles the slash command to display the config form.
 *
 * @param {object} event - chat event
 * @returns {object} Response to send back to Chat
 */
function showConfigurationForm(event) {
  // Seed the topic with any text after the slash command
  const topic = event.message?.argumentText?.trim();
  const dialog = buildConfigurationForm({
    topic,
    choices: [],
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
  const isAnonymous = formValues?.['is_anonymous']?.stringInputs.value[0] === '1';
  const allowAddOption = formValues?.['allow_add_option']?.stringInputs.value[0] === '1';
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
  const stateJson = card.sections[0].widgets[0].decoratedText.button.onClick.action.parameters[0].value;
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
