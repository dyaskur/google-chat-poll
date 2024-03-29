// Generated by CodiumAI

import {getStateFromCard, getStateFromMessageId} from '../../src/helpers/state';
import * as api from '../../src/helpers/api';

describe('getStateFromCard', () => {
  it('should return the state from the card name when it exists', () => {
    const event = {
      message: {
        cardsV2: [
          {
            card: {
              name: 'cardName',
              sections: [],
              widgets: [],
            },
          },
        ],
      },
    };
    const result = getStateFromCard(event);
    expect(result).toBe('cardName');
  });

  it('should return the state from the event parameter when it exists', () => {
    const event = {
      common: {
        parameters: {
          state: 'eventParameter',
        },
      },
      message: {
        cardsV2: [
          {
            card: {
              sections: [],
              widgets: [],
            },
          },
        ],
      },
    };
    const result = getStateFromCard(event);
    expect(result).toBe('eventParameter');
  });

  it('should return the state from the card when it has no header and the state is in the first widget', () => {
    const event = {
      message: {
        cardsV2: [
          {
            card: {
              sections: [
                {
                  widgets: [
                    {
                      decoratedText: {
                        button: {
                          onClick: {
                            action: {
                              parameters: [
                                {
                                  value: 'cardState',
                                },
                              ],
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    };
    const result = getStateFromCard(event);
    expect(result).toBe('cardState');
  });

  it(
    'should return the state from the card when it has a header and the state is in the second section\'s first widget',
    () => {
      const event = {
        message: {
          cardsV2: [
            {
              card: {
                sections: [
                  {},
                  {
                    widgets: [
                      {
                        decoratedText: {
                          button: {
                            onClick: {
                              action: {
                                parameters: [
                                  {
                                    value: 'cardState',
                                  },
                                ],
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      };
      const result = getStateFromCard(event);
      expect(result).toBe('cardState');
    });

  // Tests that the function returns undefined when the card is undefined.
  it('should return undefined when the card is undefined', () => {
    const event = {
      message: {
        cardsV2: [
          {
            card: {},
          }],
      },
    };
    const result = getStateFromCard(event);
    expect(result).toBeUndefined();
  });

  it('should return the current state when it exists in the response from callMessageApi', async () => {
    const eventId = 'exampleEventId';
    const apiResponse = {
      data: {
        cardsV2: [
          {
            card: {
              name: '{}',
              sections: [],
              widgets: [],
            },
          },
        ],
      },
    };
    jest.spyOn(api, 'callMessageApi').mockResolvedValue(apiResponse);

    const result = await getStateFromMessageId(eventId);

    expect(result).toEqual({});
  });

  it('should handle apiResponse with empty cardsV2 array and throw an error', async () => {
    const eventId = 'testEventId';
    const apiResponse = {status: 200, data: {cardsV2: null}};
    jest.spyOn(api, 'callMessageApi').mockResolvedValue(apiResponse);

    await expect(getStateFromMessageId(eventId)).rejects.toThrow('State not found');
  });
});
