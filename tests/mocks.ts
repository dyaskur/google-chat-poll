export const mockGoogleAuth = {
  getTokenInfo: jest.fn().mockResolvedValue({
    email: 'testEmail',
  }),
};

export const mockCreate = jest.fn().mockResolvedValue({
  messages: 'testEmail',
});

export const mockUpdate = jest.fn().mockResolvedValue({
  messages: 'testEmail',
});
