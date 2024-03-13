import PollCard from './PollCard';
import {LocaleTimezone, PollState, Voter} from '../helpers/interfaces';
import {chat_v1 as chatV1} from '@googleapis/chat';
import {progressBarText} from '../helpers/vote';

export default class PollDialogCard extends PollCard {
  private readonly voter: Voter;
  private readonly userVotes: number[];

  constructor(state: PollState, timezone: LocaleTimezone, voter: Voter) {
    super(state, timezone);
    this.voter = voter;
    this.userVotes = this.getUserVotes();
  }

  getUserVotes(): number[] {
    if (this.state.votes === undefined) {
      return [];
    }
    const votes = [];
    const voter = this.voter;
    for (let i = 0; i < this.state.choices.length; i++) {
      if (this.state.votes[i] !== undefined && this.state.votes[i].findIndex((x) => x.uid === voter.uid) > -1) {
        votes.push(i);
      }
    }
    return votes;
  }

  sectionInfo(): chatV1.Schema$GoogleAppsCardV1Section {
    const votedCount = this.userVotes.length;
    const voteLimit = this.state.voteLimit || this.state.choices.length;
    const voteRemaining = voteLimit - votedCount;
    let warningMessage = '';
    if (voteRemaining === 0) {
      warningMessage = 'Vote limit reached. Your vote will be overwritten.';
    }
    return {
      widgets: [
        {
          'decoratedText': {
            'text': `You have voted: ${votedCount} out of ${voteLimit} (remaining: ${voteRemaining})`,
            'wrapText': true,
            'bottomLabel': warningMessage,
          },
        },
      ],
    };
  }
  choice(index: number, text: string, voteCount: number, totalVotes: number): chatV1.Schema$GoogleAppsCardV1Widget {
    const progressBar = progressBarText(voteCount, totalVotes);

    const voteSwitch: chatV1.Schema$GoogleAppsCardV1SwitchControl = {
      'controlType': 'SWITCH',
      'name': 'mySwitchControl',
      'value': 'myValue',
      'selected': this.userVotes.includes(index),
      'onChangeAction': {
        'function': 'switch_vote',
        'parameters': [
          {
            key: 'index',
            value: index.toString(10),
          },
        ],
      },
    };
    return {
      decoratedText: {
        'bottomLabel': `${progressBar} ${voteCount}`,
        'text': text,
        'switchControl': voteSwitch,
      },
    };
  }
}
