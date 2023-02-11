const { buildConfigurationForm, MAX_NUM_OF_OPTIONS } = require('./config-form');
const { buildVoteCard } = require('./vote-card');
const {google} = require('googleapis');

/**
 * App entry point.
 */
exports.app = async (req, res) => {
  if (!(req.method === 'POST' && req.body)) {
      res.status(400).send('')
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
    if (event.action?.actionMethodName === 'start_poll') {
      reply = await startPoll(event);
    } else if (event.action?.actionMethodName === 'vote') {
        reply = recordVote(event);
    }
  }
  res.json(reply);
}

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
  const choices = [];
  for (let i = 0; i < MAX_NUM_OF_OPTIONS; ++i) {
    const choice = formValues?.[`option${i}`]?.stringInputs.value[0]?.trim();
    if (choice) {
      choices.push(choice);
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
    votes: {},
  });
  const message = {
    cards: [pollCard],
  };
  const request = {
    parent: event.space.name,
    requestBody: message,
  };
  // Use default credentials (service account)
  const credentials = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/chat.bot'],
  });
  const chatApi = google.chat({
    version: 'v1',
    auth: credentials,
  });
  await chatApi.spaces.messages.create(request);

  // Close dialog
  return {
    actionResponse: {
      type: 'DIALOG',
      dialogAction: {
        actionStatus: {
          statusCode: 'OK',
          userFacingMessage: 'Poll started.',
        },
      },
    },
  };
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
  const state = JSON.parse(parameters['state']);

  // Add or update the user's selected option
  state.votes[userId] = choice;

  const card = buildVoteCard(state);
  return {
    thread: event.message.thread,
    actionResponse: {
      type: 'UPDATE_MESSAGE',
    },
    cards: [card],
  }
}
