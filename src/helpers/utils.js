/**
 * Split string/message to topic and choice
 * reference: https://stackoverflow.com/a/18647776/2671470
 *
 * @param {string} message - the new option name
 * @returns {array} card
 */
export function splitMessage(message) {
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
