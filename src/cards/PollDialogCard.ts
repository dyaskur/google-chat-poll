import PollCard from './PollCard';
import {LocaleTimezone, PollState, Voter} from '../helpers/interfaces';
import {chat_v1 as chatV1} from '@googleapis/chat';
import {progressBarText} from '../helpers/vote';

export default class PollDialogCard extends PollCard {
  private readonly voter: Voter;
  private userVotes: number[] | undefined;

  constructor(state: PollState, timezone: LocaleTimezone, voter: Voter) {
    super(state, timezone);
    this.voter = voter;
  }
  create() {
    this.buildHeader();
    this.buildSections();
    this.buildButtons();
    this.buildFooter();
    this.card.name = this.getSerializedState();
    return this.card;
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
  choice(index: number, text: string, voteCount: number, totalVotes: number): chatV1.Schema$GoogleAppsCardV1Widget {
    this.userVotes = this.getUserVotes();

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
