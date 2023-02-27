const {splitMessage} = require('./helpers/utils');
/** Upper bounds on number of choices to present. */
const MAX_NUM_OF_OPTIONS = 10;

/**
 * Build widget with instructions on how to use form.
 *
 * @returns {object} card widget
 */
function helpText() {
  return {
    textParagraph: {
      text: 'Enter the poll topic and up to 10 choices in the poll. Blank options will be omitted.',
    },
  };
}

/**
 * Build the text input for a choice.
 *
 * @param {number} index - Index to identify the choice
 * @param {string|undefined} value - Initial value to render (optional)
 * @returns {object} card widget
 */
function optionInput(index, value) {
  return {
    textInput: {
      label: `Option ${index + 1}`,
      type: 'SINGLE_LINE',
      name: `option${index}`,
      value: value || '',
    },
  };
}

/**
 * Build the text input for the poll topic.
 *
 * @param {string|undefined} topic - Initial value to render (optional)
 * @returns {object} card widget
 */
function topicInput(topic) {
  return {
    textInput: {
      label: 'Topic',
      type: 'MULTIPLE_LINE',
      name: 'topic',
      value: topic || '',
    },
  };
}

/**
 * Build the buttons/actions for the form.
 *
 * @returns {object} card widget
 */
function fixedFooter() {
  return {
    'primaryButton': {
      'text': 'Submit',
      'onClick': {
        'action': {
          'function': 'start_poll',
        },
      },
    },
  };
}

/**
 * Build the configuration form.
 *
 * @param {object} options - Initial state to render with form
 * @param {string|undefined} options.topic - Topic of poll (optional)
 * @param {string[]|undefined} options.choices - Text of choices to display to users (optional)
 * @returns {object} card
 */
function buildConfigurationForm(options) {
  const widgets = [];
  widgets.push(helpText());
  widgets.push(topicInput(options.topic));
  for (let i = 0; i < MAX_NUM_OF_OPTIONS; ++i) {
    const choice = options?.choices?.[i];
    widgets.push(optionInput(i, choice));
  }

  // Assemble the card
  return {
    'sections': [
      {
        'collapsible': true,
        'uncollapsibleWidgetsCount': 6,
        widgets,
      },
      {
        'widgets': [
          {
            'decoratedText': {
              'bottomLabel': 'If this checked the voters name will be not shown',
              'text': 'Anonymous voter',
              'switchControl': {
                'controlType': 'SWITCH',
                'name': 'is_anonymous',
                'value': '1',
                'selected': true,
              },
            },
            'horizontalAlignment': 'CENTER',
          },
          {
            'decoratedText': {
              'bottomLabel': 'After the poll is created, other member can add more option',
              'text': 'Allow to add more option(s)',
              'switchControl': {
                'controlType': 'SWITCH',
                'name': 'allow_add_option',
                'value': '1',
                'selected': true,
              },
            },
            'horizontalAlignment': 'CENTER',
          },
        ],
      },
    ],
    'fixedFooter': fixedFooter(),
  };
}

/**
 * Build poll options from message sent by user.
 *
 * @param {string} message - message or text after poll command
 * @returns {object} option
 */
function buildOptionsFromMessage(message) {
  const explodedMesage = splitMessage(message);
  const topic = explodedMesage[0] !== 'undefined' && explodedMesage[0] ? explodedMesage[0] : '';
  if (explodedMesage.length > 0) {
    explodedMesage.shift();
  }
  return {
    topic,
    choices: explodedMesage,
  };
}

exports.MAX_NUM_OF_OPTIONS = MAX_NUM_OF_OPTIONS;
exports.buildConfigurationForm = buildConfigurationForm;
exports.buildOptionsFromMessage = buildOptionsFromMessage;
