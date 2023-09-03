import BaseCard from './BaseCard';
import {ClosableType, localeTimezone, PollState, Voter} from '../helpers/interfaces';
import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';
import {ICON_URL_48X48} from '../config/default';
import {progressBarText} from '../helpers/vote';

export default class PollCard extends BaseCard {
  private readonly state: PollState;
  private readonly timezone: localeTimezone;

  constructor(state: PollState, timezone: localeTimezone) {
    super();
    this.state = state;
    this.timezone = timezone;
  }

  create() {
    this.buildHeader();
    this.buildSections();
    this.buildButtons();
    this.buildFooter();
    this.card.name = this.getSerializedState();
    return this.card;
  }

  buildHeader() {
    if (this.state.topic.length > 40) {
      const widgetHeader = this.sectionHeader();
      this.card.sections!.push(widgetHeader);
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
    const votes: Array<Array<Voter>> = Object.values(this.state.votes ?? {});
    const totalVotes: number = votes.reduce((sum, vote) => sum + vote.length, 0);
    for (let i = 0; i < this.state.choices.length; ++i) {
      const creator = this.state.choiceCreator?.[i] ?? '';
      const section = this.choiceSection(i, totalVotes, creator);
      this.card.sections!.push(section);
    }
  }

  buildButtons() {
    const buttons = [];
    if (this.state.optionable) {
      buttons.push(this.createButton('Add Option', 'add_option_form', 'OPEN_DIALOG'));
    }
    const isClosable = this.state.type === undefined || this.state.type !== ClosableType.UNCLOSEABLE;

    if (isClosable) {
      const closeButton = this.createButton('Close Poll', 'close_poll_form', 'OPEN_DIALOG');
      if (this.isClosed()) {
        closeButton.disabled = true;
      }
      buttons.push(closeButton);
    }

    if (buttons.length > 0) {
      this.card.sections!.push(
        {
          'widgets': [
            {
              'buttonList': {
                buttons,
              },
            },
          ],
        });
    }
  }

  buildFooter() {
    if (!this.isClosed() && this.state.closedTime) {
      const locale = this.timezone.locale || 'en';
      try {
        const closedDate = new Date(this.state.closedTime).toLocaleString(locale, {timeZone: this.timezone.id});
        this.card.sections!.push(
          {
            'widgets': [
              {
                'decoratedText': {
                  'text': `<i>Auto Close at <time> ${closedDate}</time>  ${this.timezone.id} </i>`,
                  'startIcon': {
                    'knownIcon': 'CLOCK',
                    'altText': '@',
                  },
                },
              },
            ],
          });
      } catch (e) {
        // the most possible error is because of timezone issue, so just ignore
        console.log(e, JSON.stringify(this.timezone));
      }
    } else if (this.isClosed()) {
      this.card.sections!.push(
        {
          'widgets': [
            {
              'decoratedText': {
                'text': `This poll was closed at by ${this.state.closedBy}`,
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
    const voteButton: chatV1.Schema$GoogleAppsCardV1Button = {
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
    };

    if (this.isClosed()) {
      voteButton.disabled = true;
    }
    return {
      decoratedText: {
        bottomLabel: `${progressBar} ${voteCount}`,
        text: text,
        button: voteButton,
      },
    };
  }

  private isClosed(): boolean {
    return this.state.closedTime !== undefined && this.state.closedTime <= Date.now();
  }
}
