export const mockGoogleAuth = {
  getTokenInfo: jest.fn().mockResolvedValue({
    email: 'testEmail',
  }),
  queuePath: jest.fn().mockResolvedValue({
    email: 'testEmail',
  }),
};

export const mockCreate = jest.fn().mockResolvedValue({
  messages: 'testEmail',
  data: {name: true},
});

export const mockUpdate = jest.fn().mockResolvedValue({
  messages: 'testEmail',
  data: {name: true},

});

export const mockCreateTask = jest.fn().mockResolvedValue([{name: 'testEmail'}]);

export const mockQueuePath = jest.fn().mockResolvedValue({
  messages: 'testEmail',
  data: {name: true},
});
