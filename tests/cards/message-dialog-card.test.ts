import {MessageDialogConfig} from '../../src/helpers/interfaces';
import MessageDialogCard from '../../src/cards/MessageDialogCard';

describe('MessageDialogCard', () => {
  it('should return a valid GoogleAppsCardV1Card object when called with a valid MessageDialogConfig object', () => {
    const config: MessageDialogConfig = {
      title: 'Test Title',
      message: 'Test Message',
      imageUrl: 'https://example.com/image.jpg',
    };

    const messageDialogCard = new MessageDialogCard(config);
    const result = messageDialogCard.create();

    expect(result).toEqual(expect.objectContaining({
      header: expect.objectContaining({
        title: 'Test Title',
        subtitle: 'Test Message',
        imageUrl: 'https://example.com/image.jpg',
        imageType: 'CIRCLE',
      }),
      sections: [],
    }));
  });


  it('should set the header object with default values for missing properties', () => {
    const config: MessageDialogConfig = {
      title: 'Test Title',
      message: 'Test Message',
    };

    const messageDialogCard = new MessageDialogCard(config);

    expect(messageDialogCard.create()).toEqual(expect.objectContaining({
      header: expect.objectContaining({
        title: 'Test Title',
        subtitle: 'Test Message',
        imageUrl: undefined,
        imageType: 'CIRCLE',
      }),
    }));
  });
});
