import {PollConfig} from './interfaces';

/**
 * Split string/message to topic and choice
 * reference: https://stackoverflow.com/a/18647776/2671470
 *
 * @param {string} message - the new option name
 * @returns {array} card
 */
export function splitMessage(message: string) {
  const expression = /[^\s"]+|"([^"]*)"/gi;
  const result = [];
  let match;
  do {
    match = expression.exec(message);
    if (match != null) {
      result.push(match[1] ? match[1] : match[0]);
    }
  } while (match != null);

  return result;
}

/**
 * Build poll options from message sent by user.
 *
 * @param {string} message - message or text after poll command
 * @returns {object} option
 */
export function buildOptionsFromMessage(message: string): PollConfig {
  const explodedMesage = splitMessage(message);
  const topic = explodedMesage[0] !== 'undefined' && explodedMesage[0] ?
    explodedMesage[0] :
    '';
  if (explodedMesage.length > 0) {
    explodedMesage.shift();
  }
  return {
    topic,
    choices: explodedMesage,
  };
}
