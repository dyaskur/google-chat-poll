import {choiceSection} from './helpers/vote';
import {ICON_URL_48X48} from './config/default';
import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';
import {PollState, Voter} from './helpers/interfaces';

/**
 * Builds the card header including the question and author details.
 *
 * @param {string} topic - Topic of the poll
 * @param {string} author - Display name of user that created the poll
 * @returns {chatV1.Schema$GoogleAppsCardV1CardHeader} card header
 */
function cardHeader(topic: string, author: string): chatV1.Schema$GoogleAppsCardV1CardHeader {
  return {
    title: topic,
    subtitle: `Posted by ${author}`,
    imageUrl: ICON_URL_48X48,
    imageType: 'CIRCLE',
  };
}

/**
 * Builds the section header using decoratedText instead of card header if the topic title is too long
 *
 * @param {string} topic - Topic of the poll
 * @param {string} author - Display name of user that created the poll
 * @returns {chatV1.Schema$GoogleAppsCardV1Section} card section
 */
function sectionHeader(topic: string, author: string): chatV1.Schema$GoogleAppsCardV1Section {
  return {
    widgets: [
      {
        'decoratedText': {
          'text': topic,
          'wrapText': true,
          'bottomLabel': `Posted by ${author}`,
          'startIcon': {
            'altText': 'Absolute Poll',
            'iconUrl': ICON_URL_48X48,
            'imageType': 'SQUARE',
          },
        },
      },
    ],
  };
}

/**
 * Builds the configuration form.
 *
 * @param {object} state - Current state of poll
 * @param {object} state.author - User that submitted the poll
 * @param {string} state.topic - Topic of poll
 * @param {string[]} state.choices - Text of choices to display to users
 * @param {object} state.votes - Map of cast votes keyed by choice index
 * @param {object} state.choiceCreator - Map of cast votes keyed by choice index
 * @param {boolean} state.anon - Is anonymous?(will save voter name or not)
 * @param {boolean} state.optionable - Can other user add other option?
 * @returns {object} card
 */
export function buildVoteCard(state: PollState) {
  const sections = [];
  const stateString = JSON.stringify(state);

  const votes: Array<Array<Voter>> = Object.values(state.votes);
  const totalVotes: number = votes.reduce((sum, vote) => sum + vote.length, 0);
  for (let i = 0; i < state.choices.length; ++i) {
    const creator = state.choiceCreator?.[i];
    const section = choiceSection(i, state, totalVotes, stateString, creator);
    sections.push(section);
  }
  if (state.optionable) {
    sections.push(
        {
          'widgets': [
            {
              'buttonList': {
                'buttons': [
                  {
                    'text': 'Add Option',
                    'onClick': {
                      'action': {
                        'function': 'add_option_form',
                        'interaction': 'OPEN_DIALOG',
                        'parameters': [],
                      },
                    },
                  },
                ],
              },
            },
          ],
        });
  }
  const card: chatV1.Schema$CardWithId = {
    'cardId': 'unique-card-id',
    'card': {
      sections,
    },
  };
  if (state.topic.length > 40) {
    const widgetHeader = sectionHeader(state.topic, state.author.displayName);
    card.card.sections = [widgetHeader, ...sections];
  } else {
    card.card.header = cardHeader(state.topic, state.author.displayName);
  }
  return card;
}
