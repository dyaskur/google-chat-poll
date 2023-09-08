// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import TaskHandler from '../src/handlers/TaskHandler';
import * as yaskur from '../src/helpers/api';
import {chat_v1 as chatV1} from 'googleapis';

afterEach(() => {
  jest.clearAllMocks();
});
describe('remind_all', () => {
  it('process remind_all task', async () => {
    const closedTime = Date.now() + 420000;
    const cardMessage: chatV1.Schema$GoogleAppsCardV1Card = {
      cardsV2: [
        {card: {name: `{"topic":"topic","closedTime":${closedTime}}`}},
      ],
    };

    const responseData = {
      'space': {
        'spaceHistoryState': 'HISTORY_ON',
        'singleUserBotDm': true,
        'name': 'spaces/ntf08kAAAAE',
        'spaceThreadingState': 'UNTHREADED_MESSAGES',
        'type': 'DM',
        'spaceType': 'DIRECT_MESSAGE',
      },
      'thread': {
        'name': 'spaces/ntf08kAAAAE/threads/UuATZQb_Ho4',
      },
      ...cardMessage,
    };
    // Mock the callMessageApi function to return a successful response
    const apiResponse = {status: 200, data: responseData};
    jest.spyOn(yaskur, 'callMessageApi').mockResolvedValue(apiResponse);

    // Call the process method
    const taskHandler = new TaskHandler({id: '123', action: 'remind_all', type: 'TASK'});

    await taskHandler.process();

    expect(yaskur.callMessageApi).toHaveBeenCalledWith('get', {
      name: '123',
    });
    expect(yaskur.callMessageApi).toHaveBeenCalledWith('create', expect.objectContaining({
      'name': '123',
      'messageReplyOption': 'REPLY_MESSAGE_FALLBACK_TO_NEW_THREAD',
    }));
  });

  it('process remind_all task with closed poll will do nothing', async () => {
    const currentState = {closedTime: Date.now() - 1000};
    jest.spyOn(TaskHandler.prototype, 'getStateFromMessageId').mockResolvedValue(currentState);

    // Mock the callMessageApi function to return a successful response
    const apiResponse = {status: 200};
    jest.spyOn(yaskur, 'callMessageApi').mockResolvedValue(apiResponse);

    // Call the process method
    const taskHandler = new TaskHandler({id: '123', action: 'remind_all', type: 'TASK'});

    await taskHandler.process();

    expect(yaskur.callMessageApi).not.toHaveBeenCalled();
  });
});
