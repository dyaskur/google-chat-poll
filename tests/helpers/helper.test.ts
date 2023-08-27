import {generateHelpText} from '../../src/helpers/helper';

describe('generateHelpText', () => {
  it('should return a string with a greeting, description, example commands, and footer', () => {
    const isPrivate = false;

    const result = generateHelpText(isPrivate);

    expect(typeof result).toBe('string');
    expect(result).toContain('Below is an example commands');
    expect(result).not.toContain('group'); // group is additional message from getRandomInfo()
  });


  it('should include an additional message if isPrivate is true', () => {
    const isPrivate = true;

    const result = generateHelpText(isPrivate);

    expect(result).toContain('You will need to fill out the topic and answers in the form that will be displayed');
    expect(result).toContain('group'); // group is additional message from getRandomInfo()
  });
});
