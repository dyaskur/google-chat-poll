import NewPollFormCard from '../cards/NewPollFormCard';
import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';
import BaseHandler from './BaseHandler';
import {buildOptionsFromMessage} from '../helpers/utils';
import {generateHelpText} from '../helpers/helper';

export default class CommandHandler extends BaseHandler {
  private slashCommand: chatV1.Schema$SlashCommandMetadata | undefined;

  public constructor(event: chatV1.Schema$DeprecatedEvent) {
    super(event);
    this.parseSlashCommand();

    if (this.slashCommand === undefined) {
      throw new Error('No Slash Command found');
    }
  }

  parseSlashCommand() {
    this.getAnnotations().forEach((annotation) => {
      if (annotation.type === 'SLASH_COMMAND') {
        this.slashCommand = annotation.slashCommand!;
      }
    });
  }

  process(): chatV1.Schema$Message {
    switch (this.slashCommand!.commandName) {
      case '/poll':
        const argumentText = this.event.message?.argumentText?.trim() ?? '';
        const options = buildOptionsFromMessage(argumentText);
        return {
          actionResponse: {
            type: 'DIALOG',
            dialogAction: {
              dialog: {
                body: new NewPollFormCard(options).create(),
              },
            },
          },
        };
      default:
        const isPrivate = this.event!.space?.type === 'DM';
        return {
          thread: this.event.message!.thread,
          actionResponse: {
            type: 'NEW_MESSAGE',
          },
          text: generateHelpText(isPrivate),
        };
    }
  }
}
