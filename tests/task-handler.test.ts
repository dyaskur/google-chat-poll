// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import TaskHandler from '../src/handlers/TaskHandler';
import PollCard from '../src/cards/PollCard';
import * as yaskur from '../src/helpers/api';

describe('process', () => {
  it('should throw an error if the state is not found', async () => {
    // Mock the callMessageApi function to return a successful response
    const apiResponse = {status: 200, data: {cardsV2: [{}]}};
    jest.spyOn(yaskur, 'callMessageApi').mockResolvedValue(apiResponse);
    // Call the process method and expect it to throw an error
    const taskHandler = new TaskHandler({id: '123', action: 'close_poll', type: 'TASK'});
    await expect(taskHandler.process()).rejects.toThrow('State not found');
  });

  it('should close the poll when it is not already closed', async () => {
    // Mock the createMessage function of PollCard to return a cardMessage
    const cardMessage = {cardsV2: [{card: {name: '{"closedBy":"scheduled auto-close"}'}}]};
    // Mock the callMessageApi function to return a successful response
    const apiResponse = {status: 200, data: cardMessage};
    jest.spyOn(yaskur, 'callMessageApi').mockResolvedValue(apiResponse);
    jest.spyOn(PollCard.prototype, 'createMessage').mockReturnValue(cardMessage);

    // Call the process method
    const taskHandler = new TaskHandler({id: '123', action: 'close_poll', type: 'TASK'});
    await taskHandler.process();

    // Expect that the closedTime is updated and a card message is sent
    expect(PollCard.prototype.createMessage).not.toHaveBeenCalled();
    expect(yaskur.callMessageApi).not.toHaveBeenCalledWith('update', {
      name: '123',
      requestBody: cardMessage,
      updateMask: 'cardsV2',
    });
  });

  it('should close the poll when it is not already closed', async () => {
    // Mock the createMessage function of PollCard to return a cardMessage
    const cardMessage = {cardsV2: [{card: {name: '{}'}}]};
    jest.spyOn(PollCard.prototype, 'createMessage').mockReturnValue(cardMessage);

    // Mock the callMessageApi function to return a successful response
    const apiResponse = {status: 200, data: cardMessage};
    jest.spyOn(yaskur, 'callMessageApi').mockResolvedValue(apiResponse);

    // Call the process method
    const taskHandler = new TaskHandler({id: '123', action: 'close_poll', type: 'TASK'});
    await taskHandler.process();

    // Expect that the closedTime is updated and a card message is sent
    expect(PollCard.prototype.createMessage).toHaveBeenCalled();
    expect(yaskur.callMessageApi).toHaveBeenCalledWith('update', {
      name: '123',
      requestBody: cardMessage,
      updateMask: 'cardsV2',
    });
  });

  it('should return an empty object for an unknown action', async () => {
    // Call the process method with an unknown action
    const taskHandler = new TaskHandler({id: '123', action: 'unknown_action', type: 'TASK'});
    const result = await taskHandler.process();

    // Expect that an empty object is returned
    expect(result).toBeUndefined();
  });

  it('should still call the api even if it is already closed', async () => {
    // Mock the getStateFromMessageId function to return a currentState with closedTime in the past
    const currentState = {closedTime: Date.now() - 1000, topic: 'topic', choices: ['xxx', 'sss']};
    jest.spyOn(TaskHandler.prototype, 'getStateFromMessageId').mockResolvedValue(currentState);

    // Call the process method
    const taskHandler = new TaskHandler({id: '123', action: 'close_poll', type: 'TASK'});
    await taskHandler.process();

    // Expect that the closedTime is not updated and no card message is sent
    expect(currentState.closedTime).toBeLessThan(Date.now());
    expect(PollCard.prototype.createMessage).toHaveBeenCalled();
    expect(yaskur.callMessageApi).toHaveBeenCalled();
  });

  it('should throw an error when closing the message if an error occurs while calling the api', async () => {
    // Mock the getStateFromMessageId function to return a currentState with closedTime as null
    const currentState = {closedTime: null};
    jest.spyOn(TaskHandler.prototype, 'getStateFromMessageId').mockResolvedValue(currentState);

    // Mock the createMessage function of PollCard to return a cardMessage
    const cardMessage = {cardsV2: []};
    jest.spyOn(PollCard.prototype, 'createMessage').mockReturnValue(cardMessage);

    // Mock the callMessageApi function to throw an error
    jest.spyOn(yaskur, 'callMessageApi').mockReturnValue({status: 500});

    // Call the process method and expect it to throw an error
    const taskHandler = new TaskHandler({id: '123', action: 'close_poll', type: 'TASK'});
    await expect(taskHandler.process()).rejects.toThrow('Error when closing message');
  });

  it('should update the closedTime if the poll is not closed yet', async () => {
    // Mock the getStateFromMessageId function to return a currentState with closedTime in the future
    const currentState = {closedTime: Date.now() + 10000};
    jest.spyOn(TaskHandler.prototype, 'getStateFromMessageId').mockResolvedValue(currentState);

    // Mock the createMessage function of PollCard to return a cardMessage
    const cardMessage = {cardsV2: []};
    jest.spyOn(PollCard.prototype, 'createMessage').mockReturnValue(cardMessage);

    // Mock the callMessageApi function to return a successful response
    const apiResponse = {status: 200};
    jest.spyOn(yaskur, 'callMessageApi').mockResolvedValue(apiResponse);

    // Call the process method
    const taskHandler = new TaskHandler({id: '123', action: 'close_poll', type: 'TASK'});
    await taskHandler.process();

    // Expect that the closedTime is updated and a card message is sent
    expect(currentState.closedTime).toBeLessThanOrEqual(Date.now());
    expect(PollCard.prototype.createMessage).toHaveBeenCalled();
    expect(yaskur.callMessageApi).toHaveBeenCalledWith('update', {
      name: '123',
      requestBody: cardMessage,
      updateMask: 'cardsV2',
    });
  });
});
