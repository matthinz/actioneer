const { applyMiddleware } = require('./src/apply_middleware');
const { createActionExecutor } = require('./src/action_executor');
const { isAction } = require('./src/is_action');

const { createReturnedActionsMiddleware } = require('./src/middleware/returned_actions');
const { payloadOnlyMiddleware } = require('./src/middleware/payload_only');

module.exports = {
    applyMiddleware,
    createActionExecutor,
    isAction,
    createReturnedActionsMiddleware,
    payloadOnlyMiddleware,
};
