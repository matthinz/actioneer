const { isAction } = require('../is_action');

function createReturnedActionsMiddleware(handleReturnedAction) {
    if (typeof handleReturnedAction !== 'function') {
        throw new TypeError(
            `handleReturnedAction should be a function, but is ${typeof handleReturnedAction}`
        );
    }

    return function returnedActionsMiddleware(action, next) {
        return next().then(result => {
            if (isAction(result)) {
                return handleReturnedAction(result);
            }
            return result;
        });
    };
}

module.exports = { createReturnedActionsMiddleware };
