export const mockCreatePollDialogCard = jest.fn(() => 'card');
export default jest.fn(() => {
  return {
    create: mockCreatePollDialogCard,
  };
});
