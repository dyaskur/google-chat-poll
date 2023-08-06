import {PollState} from './helpers/interfaces';
import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';

/**
 * Build the add option form.
 *
 * @param {object} state - the current message state
 * @returns {object} card
 */
export function buildAddOptionForm(state: PollState): chatV1.Schema$GoogleAppsCardV1Card {
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
              }],
          },
        },
      },
    },
  };
}
