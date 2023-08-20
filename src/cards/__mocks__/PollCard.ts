export const mockCreateCardWithId = jest.fn(() => 'card');
export const mockCreateMessage = jest.fn(() => {
  return {cardsV2: []};
});
export default jest.fn(() => {
  return {
    createCardWithId: mockCreateCardWithId,
    createMessage: mockCreateMessage,
  };
});
