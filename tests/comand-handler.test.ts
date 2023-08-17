import {CommandHandler} from '../src/handlers/CommandHandler';
import {NewPollFormCard} from '../src/cards/NewPollFormCard';

describe('process command from google chat message event', () => {
  test('should return a message with a dialog action when the slash command is poll and the argument text is provided',
    () => {
      const event = {
        message: {
          annotations: [
            {
              type: 'SLASH_COMMAND',
              slashCommand: {
                commandName: 'poll',
              },
            },
          ],
          argumentText: '"Which is the best country to visit" Indonesia Thailand',
        },
      };
      const handler = new CommandHandler(event);
      const result = handler.process();
      expect(result.actionResponse.type).toEqual('DIALOG');
      expect(result.actionResponse.dialogAction.dialog.body).toEqual(new NewPollFormCard({
        topic: 'Which is the best country to visit',
        choices: ['Indonesia', 'Thailand'],
      }).create());
    });

  it('should return a message with a new message action and welcome text when the slash command is not recognized',
    () => {
      const event = {
        message: {
          annotations: [
            {
              type: 'SLASH_COMMAND',
              slashCommand: {
                commandName: 'unknown',
              },
            },
          ],
        },
      };
      const handler = new CommandHandler(event);
      const result = handler.process();
      expect(result.actionResponse.type).toEqual('NEW_MESSAGE');
      expect(result.text).toContain('Hi there! I can help you create polls to enhance collaboration and efficiency');
    });

  it('should throw an error when no slash command is found in the message annotations', () => {
    const event = {
      message: {
        annotations: [],
      },
    };
    expect(() => new CommandHandler(event)).toThrow('No Slash Command found');
  });

  it('should handle gracefully when the argument text is undefined or empty', () => {
    const event = {
      message: {
        annotations: [
          {
            type: 'SLASH_COMMAND',
            slashCommand: {
              commandName: 'poll',
            },
          },
        ],
      },
    };
    const handler = new CommandHandler(event);
    const result = handler.process();
    expect(result.actionResponse.type).toEqual('DIALOG');
    expect(result.actionResponse.dialogAction.dialog.body).toEqual(new NewPollFormCard({
      topic: '',
      choices: [],
    }).createCardWithId().card);
  });

  it('should make a new poll form card with the correct options when the argument text is provided', () => {
    const event = {
      message: {
        annotations: [
          {
            type: 'SLASH_COMMAND',
            slashCommand: {
              commandName: 'poll',
            },
          },
        ],
        argumentText: '"Which is the best country to visit" Indonesia Thailand',
      },
    };
    const handler = new CommandHandler(event);
    const result = handler.process();
    const expectedCard = new NewPollFormCard({
      topic: 'Which is the best country to visit',
      choices: ['Indonesia', 'Thailand'],
    }).create();
    expect(result.actionResponse.dialogAction.dialog.body).toEqual(expectedCard);
  });

  it('should make a poll form card with the correct footer and sections', () => {
    const event = {
      message: {
        annotations: [
          {
            type: 'SLASH_COMMAND',
            slashCommand: {
              commandName: 'poll',
            },
          },
        ],
        argumentText: '"Which is the best country to visit"\nIndonesia\nThailand',
      },
    };
    const handler = new CommandHandler(event);
    const result = handler.process();
    const expectedCard = new NewPollFormCard({
      topic: 'Which is the best country to visit',
      choices: ['Indonesia', 'Thailand'],
    }).create();
    expect(expectedCard).toEqual(result.actionResponse.dialogAction.dialog.body);
    expect(expectedCard.fixedFooter.primaryButton.text).toEqual('Submit');
    expect(expectedCard.sections.length).toEqual(2);
  });

  it('should limit the number of options to 10', () => {
    const event = {
      message: {
        annotations: [
          {
            type: 'SLASH_COMMAND',
            slashCommand: {
              commandName: 'poll',
            },
          },
        ],
        argumentText: '"Which is the best country to visit"\nIndonesia\nThailand\nVietnam\nUSA\nCanada\nMexico\nBrazil\nArgentina\nChile\nPeru\nAustralia',
      },
    };
    const handler = new CommandHandler(event);
    const result = handler.process();
    const card = new NewPollFormCard({
      topic: 'Which is the best country to visit',
      choices: ['Indonesia', 'Thailand', 'Vietnam', 'USA', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Peru'],
    }).createCardWithId().card;
    expect(result.actionResponse.type).toEqual('DIALOG');
    expect(result.actionResponse.dialogAction.dialog.body).toEqual(card);
  });

  it('should make a poll form card with the correct footer and sections', () => {
    const event = {
      message: {
        annotations: [
          {
            type: 'SLASH_COMMAND',
            slashCommand: {
              commandName: 'poll',
            },
          },
        ],
        argumentText: '"Which is the best country to visit"\nIndonesia\nThailand',
      },
    };
    const handler = new CommandHandler(event);
    const result = handler.process();
    const card = new NewPollFormCard({
      topic: 'Which is the best country to visit',
      choices: ['Indonesia', 'Thailand'],
    }).createCardWithId().card;
    expect(result.actionResponse.type).toEqual('DIALOG');
    expect(result.actionResponse.dialogAction.dialog.body).toEqual(card);
  });
});
