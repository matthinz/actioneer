/**
 * Middleware that forwards on *only* the payload of the action.
 */
function payloadOnlyMiddleware(action, next) {
    return next(action.payload);
}

module.exports = { payloadOnlyMiddleware };
