// Returns whether something looks like an action.
function isAction(action) {
    return (
        typeof action === 'object' &&
        typeof action.type === 'string'
    );
}

module.exports = { isAction };
