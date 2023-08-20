// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {PollConfig} from '../../src/helpers/interfaces';
import AddOptionFormCard from '../../src/cards/AddOptionFormCard';

describe('AddOptionFormCard', () => {
  it('should set the title and subtitle of the header correctly when buildHeader() is called', () => {
    const config: PollConfig = {
      topic: 'Test Topic',
      choices: ['Choice 1', 'Choice 2'],
    };
    const addOptionFormCard = new AddOptionFormCard(config);
    addOptionFormCard.buildHeader();
    expect(addOptionFormCard.card.header.title).toBe('Add a new option/choice');
    expect(addOptionFormCard.card.header.subtitle).toBe('Q:Test Topic');
  });

  it('should set the label, type, name, and hintText of the text input widget correctly when buildSections() is called',
    () => {
      const config: PollConfig = {
        topic: 'Test Topic',
        choices: ['Choice 1', 'Choice 2'],
      };
      const addOptionFormCard = new AddOptionFormCard(config);
      addOptionFormCard.buildSections();
      const widget = addOptionFormCard.card.sections[0].widgets[0];
      expect(widget.textInput.label).toBe('Option Name');
      expect(widget.textInput.type).toBe('SINGLE_LINE');
      expect(widget.textInput.name).toBe('value');
      expect(widget.textInput.hintText).toBe('');
    });

  it('should set the text and onClick action of the primary button correctly when buildFooter() is called', () => {
    const config: PollConfig = {
      topic: 'Test Topic',
      choices: ['Choice 1', 'Choice 2'],
    };
    const addOptionFormCard = new AddOptionFormCard(config);
    addOptionFormCard.buildFooter();
    const primaryButton = addOptionFormCard.card.fixedFooter.primaryButton;
    expect(primaryButton.text).toBe('Add option');
    expect(primaryButton.onClick.action.function).toBe('add_option');
    expect(primaryButton.onClick.action.parameters[0].key).toBe('state');
    expect(primaryButton.onClick.action.parameters[0].value).toBe(JSON.stringify(config));
  });

  it('should return a CardWithId object when createCardWithId() is called', () => {
    const config: PollConfig = {
      topic: 'Test Topic',
      choices: ['Choice 1', 'Choice 2'],
    };
    const addOptionFormCard = new AddOptionFormCard(config);
    const result = addOptionFormCard.createCardWithId();
    expect(result.cardId).toBe('cardId');
    expect(result.card).toBe(addOptionFormCard.create());
  });

  it('should return a Message object when createMessage() is called', () => {
    const config: PollConfig = {
      topic: 'Test Topic',
      choices: ['Choice 1', 'Choice 2'],
    };
    const addOptionFormCard = new AddOptionFormCard(config);
    const result = addOptionFormCard.createMessage();
    expect(result.cardsV2).toEqual([addOptionFormCard.createCardWithId()]);
  });
});
