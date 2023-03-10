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
function buildActionResponse(message, status = 'OK') {
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

exports.buildActionResponse = buildActionResponse;
