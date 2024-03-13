import {chat_v1 as chatV1} from '@googleapis/chat';
import {PollState, Voter, Votes} from './interfaces';

/**
 * Creates a small progress bar to show percent of votes for an option. Since
 * width is limited, the percentage is scaled to 20 steps (5% increments).
 *
 * @param {number} choice - The choice index
 * @param {object} voter - The voter
 * @param {PollState} state - PollState
 * @returns {Votes} Map of cast votes keyed by choice index
 */
export function saveVotes(choice: number, voter: Voter, state: PollState) {
  const votes: Votes = state.votes!;
  const isAnonymous = state.anon || false;
  const maxVotes = state.voteLimit === 0 ? state.choices.length : state.voteLimit || 1;
  if (maxVotes === 1) {
    Object.keys(votes).forEach(function(choiceIndex) {
      if (votes[choiceIndex]) {
        const existed = votes[choiceIndex].findIndex((x) => x.uid === voter.uid);
        if (existed > -1) {
          votes[choiceIndex].splice(existed, 1);
        }
      }
    });
  } else {
    // get current voter total vote
    let voteCount = 0;
    let voted = false;
    Object.keys(votes).forEach(function(choiceIndex) {
      if (votes[choiceIndex]) {
        const existed = votes[choiceIndex].findIndex((x) => x.uid === voter.uid);
        if (existed > -1) {
          voteCount += 1;
        }
        if (existed > -1 && parseInt(choiceIndex) === choice) {
          voted = true;
        }
      }
    });
    if (voteCount >= maxVotes || voted) {
      let deleted = false;
      Object.keys(votes).forEach(function(choiceIndex) {
        if (votes[choiceIndex]) {
          const existed = votes[choiceIndex].findIndex((x) => x.uid === voter.uid);
          if (((voteCount >= maxVotes && existed > -1 && !voted) ||
            (voted && parseInt(choiceIndex) === choice)) && !deleted) {
            votes[choiceIndex].splice(existed, 1);
            deleted = true;
          }
        }
      });
    }
    if (voted) {
      return votes;
    }
  }
  if (isAnonymous) {
    delete voter.name;
  }

  if (votes[choice]) {
    votes[choice].push(voter);
  } else {
    votes[choice] = [voter];
  }

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
export function progressBarText(voteCount: number, totalVotes: number) {
  if (voteCount === 0 || totalVotes === 0) {
    return '';
  }

  // For progress bar, calculate share of votes and scale it
  const percentage = (voteCount * 100) / totalVotes;
  const progress = Math.round((percentage / 100) * 35);
  return '█'.repeat(progress);
}

/**
 * Builds a line in the card for a single choice, including
 * the current totals and voting action.
 *
 * @param {number} i - Index to identify the choice
 * @param {object} state - Text of the choice
 * @param {number} totalVotes - Total votes cast in poll state
 * @param {string} serializedState - Serialized poll state to send in events
 * @param {string} creator - creator of the option
 * @returns {chatV1.Schema$GoogleAppsCardV1Section} card section
 */
export function choiceSection(i: number, state: PollState, totalVotes: number, serializedState: string, creator = '') {
  if (state.votes === undefined) {
    state.votes = {};
  }

  if (state.votes[i] === undefined) {
    state.votes[i] = [];
  }
  const voteCount = state.votes[i].length;
  const choiceTag = choice(i, state.choices[i], voteCount, totalVotes, serializedState);
  if (creator) {
    choiceTag.decoratedText!.topLabel = 'Added by ' + creator;
  }
  const section: chatV1.Schema$GoogleAppsCardV1Section = {
    widgets: [choiceTag],
  };
  if (state.votes[i].length > 0 && !state.anon) {
    section.collapsible = true;
    section.uncollapsibleWidgetsCount = 1;
    // @ts-ignore: already defined above
    section.widgets.push({
      'textParagraph': {
        'text': state.votes[i].map((u) => u.name).join(', '),
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
 * @returns {chatV1.Schema$GoogleAppsCardV1Widget} card widget
 */
function choice(
  index: number, text: string, voteCount: number, totalVotes: number,
  state: string): chatV1.Schema$GoogleAppsCardV1Widget {
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
