/**
 * Creates a small progress bar to show percent of votes for an option. Since
 * width is limited, the percentage is scaled to 20 steps (5% increments).
 *
 * @param {number} choice - The choice index
 * @param {object} voter - The voter
 * @param {object} votes - Total votes cast in the poll
 * @returns {object} Map of cast votes keyed by choice index
 */
function saveVotes(choice, voter, votes) {

  Object.keys(votes).forEach(function(choice_index) {
    if (votes[choice_index]) {
      const existed = votes[choice_index].findIndex(x => x.uid === voter.uid);
      if (existed > -1) {
        votes[choice_index].splice(existed, 1);
      }
    }

  });
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
  const progress = Math.round((percentage / 100) * 30);
  return '▀'.repeat(progress);
}

exports.saveVoter = saveVotes;
exports.progressBarText = progressBarText;
