/**
 * Creates a small progress bar to show percent of votes for an option. Since
 * width is limited, the percentage is scaled to 20 steps (5% increments).
 *
 * @param {number} voteCount - Number of votes for this option
 * @param {number} totalVotes - Total votes cast in the poll
 * @returns {string} Text snippet with bar and vote totals
 */
function progressBarText(voteCount, totalVotes) {
  if (voteCount === 0 || totalVotes === 0) {
    return '';
  }

  // For progress bar, calculate share of votes and scale it
  const percentage = (voteCount * 100) / totalVotes;
  const progress = Math.round((percentage / 100) * 20);
  return '▀'.repeat(progress);
}

/**
 * Builds a line in the card for a single choice, including
 * the current totals and voting action.
 *
 * @param {number} index - Index to identify the choice
 * @param {string|undefined} value - Text of the choice
 * @param {number} voteCount - Current number of votes cast for this item
 * @param {number} totalVotes - Total votes cast in poll
 * @param {string} state - Serialized state to send in events
 * @returns {object} card widget
 */
function choice(index, text, voteCount, totalVotes, state) {
  const progressBar = progressBarText(voteCount, totalVotes);
  return {
    keyValue: {
      bottomLabel: `${progressBar} ${voteCount}`,
      content: text,
      button: {
        textButton: {
          text: 'vote',
          onClick: {
            action: {
              actionMethodName: 'vote',
              parameters: [
                {
                  key: 'state',
                  value: state,
                },
                {
                  key: 'index',
                  value: index.toString(10),
                },
              ],
            },
          },
        },
      },
    },
  };
}

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
    imageStyle: 'AVATAR',
  };
}

/**
 * Builds the configuration form.
 *
 * @param {object} poll - Current state of poll
 * @param {object} poll.author - User that submitted the poll
 * @param {string} poll.topic - Topic of poll
 * @param {string[]} poll.choices - Text of choices to display to users
 * @param {object} poll.votes - Map of cast votes keyed by user ids
 * @returns {object} card
 */
function buildVoteCard(poll) {
  const widgets = [];
  const state = JSON.stringify(poll);
  const totalVotes = Object.keys(poll.votes).length;

  for (let i = 0; i < poll.choices.length; ++i) {
    // Count votes for this choice
    const votes = Object.values(poll.votes).reduce((sum, vote) => {
      if (vote === i) {
        return sum + 1;
      }
      return sum;
    }, 0);
    widgets.push(choice(i, poll.choices[i], votes, totalVotes, state));
  }

  return {
    header: header(poll.topic, poll.author.displayName),
    sections: [
      {
        widgets,
      },
    ],
  };
}

exports.buildVoteCard = buildVoteCard;
