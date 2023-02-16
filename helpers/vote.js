/**
 * Creates a small progress bar to show percent of votes for an option. Since
 * width is limited, the percentage is scaled to 20 steps (5% increments).
 *
 * @param {number} choice - The choice index
 * @param {object} voter - The voter
 * @param {object} votes - Total votes cast in the poll
 * @param {boolean} isAnonymous - save name or not
 * @returns {object} Map of cast votes keyed by choice index
 */
function saveVotes(choice, voter, votes, isAnonymous = false) {

  Object.keys(votes).forEach(function(choice_index) {
    if (votes[choice_index]) {
      const existed = votes[choice_index].findIndex(x => x.uid === voter.uid);
      if (existed > -1) {
        votes[choice_index].splice(existed, 1);
      }
    }

  });
  if (isAnonymous) {
    delete voter.name;
  }
  votes[choice].push(voter);

  return votes;
}

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
  const progress = Math.round((percentage / 100) * 35);
  return '▀'.repeat(progress);
}

/**
 * Builds a line in the card for a single choice, including
 * the current totals and voting action.
 *
 * @param {number} i - Index to identify the choice
 * @param {object} poll - Text of the choice
 * @param {number} totalVotes - Total votes cast in poll
 * @param {string} state - Serialized state to send in events
 * @returns {object} card section
 */
function choiceSection(i, poll, totalVotes, state) {
  const section = {
    'widgets': [
      choice(i, poll.choices[i], poll.votes[i].length, totalVotes, state),
    ],
  };
  if (poll.votes[i].length > 0 && !poll.anon) {
    section.collapsible = true;
    section.uncollapsibleWidgetsCount = 1;
    section.widgets.push({
      'textParagraph': {
        'text': poll.votes[i].map(u => u.name).join(', '),
      },
    });
  }
  return section;
}

/**
 * Builds a line in the card for a single choice, including
 * the current totals and voting action.
 *
 * @param {number} index - Index to identify the choice
 * @param {string|undefined} text - Text of the choice
 * @param {number} voteCount - Current number of votes cast for this item
 * @param {number} totalVotes - Total votes cast in poll
 * @param {string} state - Serialized state to send in events
 * @returns {object} card widget
 */
function choice(index, text, voteCount, totalVotes, state) {
  const progressBar = progressBarText(voteCount, totalVotes);
  return {
    decoratedText: {
      bottomLabel: `${progressBar} ${voteCount}`,
      text: text,
      button: {
        text: 'vote',
        onClick: {
          action: {
            function: 'vote',
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
  };
}

exports.saveVotes = saveVotes;
exports.progressBarText = progressBarText;
exports.choiceSection = choiceSection;
