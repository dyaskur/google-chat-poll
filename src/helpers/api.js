const {google} = require('googleapis');

/**
 * Create google api credentials
 *
 * @returns {object} google.chat
 */
function gAuth() {
  // Use default credentials (service account)
  const credentials = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/chat.bot'],
  });
  return google.chat({
    version: 'v1',
    auth: credentials,
  });
}

/**
 * Call Google API using default credentials (service account)
 *
 * @param {string} action - request action(create,update,get,delete)
 * @param {object} request - request body
 * @returns {object} Response from google api
 */
async function callMessageApi(action, request) {
  const chatApi = gAuth();
  console.log('gapi request', JSON.stringify(request));
  let response;
  if (action === 'create') {
    response = await chatApi.spaces.messages.create(request);
  } else if (action === 'update') {
    response = await chatApi.spaces.messages.update(request);
  } else if (action === 'get') {
    response = await chatApi.spaces.messages.get(request);
  }
  console.log('gapi response', JSON.stringify(response));
  return response;
}

exports.callMessageApi = callMessageApi;
