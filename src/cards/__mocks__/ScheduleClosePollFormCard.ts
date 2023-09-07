export const mockScheduleCreateClosePollFormCard = jest.fn(() => 'card');
export default jest.fn(() => {
  return {
    create: mockScheduleCreateClosePollFormCard,
  };
});
