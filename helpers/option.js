/**
 * Add a new option to the state(like DB)
 *
 * @param {string} option - the new option name
 * @param {object} state - the current message state
 * @param {string} creator - who add the new option
 * @returns {void} card
 */
function addOptionToState(option, state, creator = '') {
  const choiceLength = state.choices.length;
  state.choices.push(option);
  if (state.choiceCreator === undefined) {
    state.choiceCreator = {[choiceLength]: creator};
  } else {
    state.choiceCreator[choiceLength] = creator;
  }
}

exports.addOptionToState = addOptionToState;
