const {progressBarText, choiceSection} = require('./helpers/vote');


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
        'https://raw.githubusercontent.com/google/material-design-icons/master/png/social/poll/materialicons/24dp/2x/baseline_poll_black_24dp.png',
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
 * @param {boolean} poll.anon - Is anonymous?(will save voter name or not)
 * @returns {object} card
 */
function buildVoteCard(poll) {
  const sections = [];
  const state = JSON.stringify(poll);
  const totalVotes = Object.values(poll.votes).reduce((sum, vote) => {
    return sum + vote.length;
  }, 0);
  for (let i = 0; i < poll.choices.length; ++i) {
    const section = choiceSection(i, poll, totalVotes, state)

    sections.push(section);
  }

  const cardsV2 =
      {
        'cardId': 'unique-card-id',
        'card': {
          header: header(poll.topic, poll.author.displayName),
          sections,
        },
      };
  console.log('cardsV2', JSON.stringify(cardsV2));
  return cardsV2;
}

exports.buildVoteCard = buildVoteCard;
