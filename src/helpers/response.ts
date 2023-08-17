import {chat_v1 as chatV1} from 'googleapis/build/src/apis/chat/v1';

/**
 * Creates an action response.
 * Action Response is parameter that a Chat app can use to configure how its
 * response is posted.
 * ref: https://developers.google.com/chat/api/reference/rest/v1/spaces.messages#actionresponse
 *
 * @param {string} message - Number of votes for this option
 * @param {string} status - Status of
 * @returns {object} - ActionResponse
 */
export function buildActionResponseStatus(message: string, status = 'OK') {
  return {
    actionResponse: {
      type: 'DIALOG',
      dialogAction: {
        actionStatus: {
          statusCode: status,
          userFacingMessage: message,
        },
      },
    },
  };
}

/**
 * Creates an action response with specific type
 * ref: https://developers.google.com/chat/api/reference/rest/v1/spaces.messages#responsetype
 * @param {string} type - NEW_MESSAGE | UPDATE_MESSAGE | UPDATE_USER_MESSAGE_CARDS | REQUEST_CONFIG | DIALOG
 * @param {object} message - Card message either text or cardsV2
 * @returns {object} - ActionResponse
 */
export function buildActionResponse(type: string, message: object) {
  const responseBody: chatV1.Schema$Message = {
    actionResponse: {
      type,
    },
  };
  if (type === 'DIALOG') {
    responseBody.actionResponse!.dialogAction = {
      dialog: {
        body: message,
      },
    };
    return responseBody;
  } else {
    return {...responseBody, ...message};
  }
}
