import BaseCard from './BaseCard';
import {PollState, Voter} from '../helpers/interfaces';
import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';
import {ICON_URL_48X48} from '../config/default';
import {progressBarText} from '../helpers/vote';

export default class PollCard extends BaseCard {
  private readonly state: PollState;

  constructor(state: PollState) {
    super();
    this.state = state;
  }

  create() {
    this.buildHeader();
    this.buildSections();
    this.buildButtons();
    this.card.name = this.getSerializedState();
    return this.card;
  }

  buildHeader() {
    if (this.state.topic.length > 40) {
      const widgetHeader = this.sectionHeader();
      this.card.sections!.slice().unshift(widgetHeader);
    } else {
      this.card.header = this.cardHeader();
    }
  }

  getAuthorName() {
    return this.state.author?.displayName ?? '';
  }

  getSerializedState() {
    return JSON.stringify(this.state);
  }

  cardHeader(): chatV1.Schema$GoogleAppsCardV1CardHeader {
    return {
      title: this.state.topic,
      subtitle: `Posted by ${this.getAuthorName()}`,
      imageUrl: ICON_URL_48X48,
      imageType: 'CIRCLE',
    };
  }

  sectionHeader(): chatV1.Schema$GoogleAppsCardV1Section {
    return {
      widgets: [
        {
          'decoratedText': {
            'text': this.state.topic,
            'wrapText': true,
            'bottomLabel': `Posted by ${this.getAuthorName()}`,
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

  buildSections() {
    const votes: Array<Array<Voter>> = Object.values(this.state.votes!);
    const totalVotes: number = votes.reduce((sum, vote) => sum + vote.length, 0);
    for (let i = 0; i < this.state.choices.length; ++i) {
      const creator = this.state.choiceCreator?.[i] ?? '';
      const section = this.choiceSection(i, totalVotes, creator);
      this.card.sections!.push(section);
    }
  }

  buildButtons() {
    if (this.state.optionable) {
      this.card.sections!.push(
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
  }

  choiceSection(i: number, totalVotes: number, creator = '') {
    if (this.state.votes === undefined) {
      this.state.votes = {};
    }

    if (this.state.votes[i] === undefined) {
      this.state.votes[i] = [];
    }
    const voteCount = this.state.votes[i].length;
    const choiceTag = this.choice(i, this.state.choices[i], voteCount, totalVotes);
    if (creator) {
      choiceTag.decoratedText!.topLabel = 'Added by ' + creator;
    }
    const section: chatV1.Schema$GoogleAppsCardV1Section = {
      widgets: [choiceTag],
    };
    if (this.state.votes[i].length > 0 && !this.state.anon) {
      section.collapsible = true;
      section.uncollapsibleWidgetsCount = 1;
      // @ts-ignore: already defined above
      section.widgets.push({
        'textParagraph': {
          'text': this.state.votes[i].map((u) => u.name).join(', '),
        },
      });
    }
    return section;
  }

  choice(index: number, text: string, voteCount: number, totalVotes: number): chatV1.Schema$GoogleAppsCardV1Widget {
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
}
