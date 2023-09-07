export const mockCreateClosePollFormCard = jest.fn(() => 'card');
export default jest.fn(() => {
  return {
    create: mockCreateClosePollFormCard,
  };
});
