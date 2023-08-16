import {NewPollFormCard} from '../cards/NewPollFormCard';
import {buildOptionsFromMessage} from '../config-form';
import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';
import {BaseHandler} from './BaseHandler';

export class CommandHandler extends BaseHandler {
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
      case 'poll':
        const argumentText = this.event.message?.argumentText?.trim() ?? '';
        const options = buildOptionsFromMessage(argumentText);
        return {
          actionResponse: {
            type: 'DIALOG',
            dialogAction: {
              dialog: {
                body: new NewPollFormCard(options).build().card,
              },
            },
          },
        };
      default:
        return {
          thread: this.event.message!.thread,
          actionResponse: {
            type: 'NEW_MESSAGE',
          },
          text: 'Hi there! I can help you create polls to enhance collaboration and efficiency ' +
            'in decision-making using Google Chat™.\n' +
            '\n' +
            'Below is an example commands:\n' +
            '`/poll` - You will need to fill out the topic and answers in the form that will be displayed.\n' +
            '`/poll "Which is the best country to visit" "Indonesia"` - to create a poll with ' +
            '"Which is the best country to visit" as the topic and "Indonesia" as the answer\n' +
            '\n' +
            'We hope you find our service useful and please don\'t hesitate to contact us ' +
            'if you have any questions or concerns.',
        };
    }
  }
}
