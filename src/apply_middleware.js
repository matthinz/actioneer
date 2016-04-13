const { isPromise } = require('./is_promise');

// executes func and ensures it returns a Promise.
function runInPromise(func, ...args) {
    return new Promise((resolve, reject) => {
        try {
            const result = func.apply(this, args);
            if (isPromise(result)) {
                result.then(resolve, reject);
            } else {
                resolve(result);
            }
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * @param  {Function}      func       Function to ultimately call.
 * @param  {[Function]} middleware Middleware functions to call first.
 * @return {Function} A function that when called, returns a Promise.
 */
function applyMiddleware(func, ...middlewares) {
    'use strict';

    return function runWithMiddleware(action) {
        let nextMiddlewareIndex = 0;

        // Next *always* returns a Promise
        function next(actionPassedToNext) {
            // Call func if we've run out of middleware
            if (nextMiddlewareIndex >= middlewares.length) {
                return runInPromise(
                    func,
                    actionPassedToNext === undefined ? action : actionPassedToNext
                );
            }

            const middleware = middlewares[nextMiddlewareIndex];
            nextMiddlewareIndex++;

            try {
                const middlewareResult = middleware(
                    actionPassedToNext === undefined ? action : actionPassedToNext,
                    next
                );

                if (!isPromise(middlewareResult)) {
                    // Middleware *must* return a Promise (via `return next()`)
                    const err = new Error(`Middleware ${middleware} did not return a Promise.`);
                    err.code = 'EBADMIDDLEWARE';
                    throw err;
                }

                return middlewareResult;
            } catch (err) {
                return Promise.reject(err);
            }
        }

        return next();
    };
}

module.exports = { applyMiddleware };
