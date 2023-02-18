/**
 * Build the add option form.
 *
 * @param {object} state - the current message state
 * @returns {object} card
 */
function buildAddOptionForm(state) {
  return {
    'header': {
      'title': 'Add a new option/choice',
      'subtitle': 'Q:' + state.topic,
    },
    'sections': [
      {
        'widgets': [
          {
            'textInput': {
              'label': 'Option Name',
              'type': 'SINGLE_LINE',
              'name': 'value',
              'hintText': '',
              'value': '',
            },
            'horizontalAlignment': 'START',
          },
        ],
      },
    ],
    'fixedFooter': {
      'primaryButton': {
        'text': 'Add option',
        'onClick': {
          'action': {
            'function': 'add_option',
            'parameters': [
              {
                key: 'state',
                value: JSON.stringify(state),
              }
              ],
          },
        },
      },
    },
  };
}

exports.buildAddOptionForm = buildAddOptionForm;
