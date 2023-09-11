import {chat, auth} from '@googleapis/chat';

/**
 * Create google api credentials
 *
 * @returns {object} google.chat
 */
function gAuth() {
  // Use default credentials (service account)
  const credentials = new auth.GoogleAuth({
    // keyFile: path.join(__dirname, '../../tests/creds.json'),
    scopes: ['https://www.googleapis.com/auth/chat.bot'],
  });

  return chat({
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
export async function callMessageApi(action: string, request: object) {
  const chatApi = gAuth();
  let response;

  try {
    if (action === 'create') {
      response = await chatApi.spaces.messages.create(request);
    } else if (action === 'update') {
      response = await chatApi.spaces.messages.update(request);
    } else if (action === 'get') {
      response = await chatApi.spaces.messages.get(request);
    }
  } catch (error) {
    // @ts-ignore: all error should have this method
    const errorMessage = error.message ?? error.toString() ?? 'Unknown error';
    console.error('Error:', action, JSON.stringify(request), response, errorMessage);
    throw new Error(errorMessage);
  }

  if (!response) {
    throw new Error('Empty response');
  }

  return response;
}
