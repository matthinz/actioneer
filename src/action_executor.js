const { applyMiddleware } = require('./apply_middleware');
const { isAction } = require('./is_action');

function createActionExecutor(options) {
    'use strict';

    const {
        resolveFunctionForAction,
        middleware = [],
    } = (options || {});

    if (typeof resolveFunctionForAction !== 'function') {
        throw new TypeError('resolveFunctionForAction must be a function.');
    }

    return function actionExecutor(action) {
        return new Promise((resolve, reject) => {
            if (!isAction(action)) {
                throw new TypeError(
                    `actionExecutor() must be passed an action, received ${typeof action}`
                );
            }

            // 1. Resolve action into a function to execute
            const func = resolveFunctionForAction(action);

            if (typeof func !== 'function') {
                throw new Error(
                    `Unable resolve action '${action.type}' into a function to execute.`
                );
            }

            // 2. Apply standard middleware.
            const funcWithMiddleware = applyMiddleware(func, ...middleware);

            // 3. Execute! Once wrapped with middleware it *always* returns a Promise.
            return funcWithMiddleware(action).then(resolve, reject);
        });
    };
}

module.exports = { createActionExecutor };
