const {choiceSection} = require('./helpers/vote');

/**
 * Builds the card header including the question and author details.
 *
 * @param {string} topic - Topic of the poll
 * @param {string} author - Display name of user that created the poll
 * @returns {object} card widget
 */
function header(topic, author) {
  return {
    title: topic,
    subtitle: `Posted by ${author}`,
    imageUrl:
        'https://raw.githubusercontent.com/dyaskur/google-chat-poll/master/assets/logo48x48.png',
    imageType: 'CIRCLE',
  };
}

/**
 * Builds the configuration form.
 *
 * @param {object} poll - Current state of poll
 * @param {object} poll.author - User that submitted the poll
 * @param {string} poll.topic - Topic of poll
 * @param {string[]} poll.choices - Text of choices to display to users
 * @param {object} poll.votes - Map of cast votes keyed by choice index
 * @param {object} poll.choiceCreator - Map of cast votes keyed by choice index
 * @param {boolean} poll.anon - Is anonymous?(will save voter name or not)
 * @param {boolean} poll.optionable - Can other user add other option?
 * @returns {object} card
 */
function buildVoteCard(poll) {
  const sections = [];
  const state = JSON.stringify(poll);
  const totalVotes = Object.values(poll.votes).reduce((sum, vote) => {
    return sum + vote.length;
  }, 0);
  for (let i = 0; i < poll.choices.length; ++i) {
    const creator = poll.choiceCreator?.[i];
    const section = choiceSection(i, poll, totalVotes, state, creator);
    sections.push(section);
  }
  if (poll.optionable) {
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
  return {
    'cardId': 'unique-card-id',
    'card': {
      header: header(poll.topic, poll.author.displayName),
      sections,
    },
  };
}

exports.buildVoteCard = buildVoteCard;
