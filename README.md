A Promise-based functional Command Pattern implementation in Javascript. Only instead of "Command", we say "Action". Actions are split into three parts:

- **Action Definition**  - A simple, serializable description of the action to be executed, its inputs, and context.
- **Action Function** - The function that gets called to perform the action and (optionally) returns a result.
- **Action Executor** - A function that receives the Action Definition, runs it through a middleware stack, passes the result to the Action Function, and returns a `Promise` of the result.

An Action Definition looks like this:

```javascript
const myAction = {
    type: 'send_email',
    payload: {
        to: 'foo@example.org',
        subject: 'You are hearing me talk',
        body: '🗣',
    },
    meta: {
        'timestamp': '2016-04-12T23:25:14.017Z',
    },
};
```

(This format is inspired by [Flux Standard Actions](https://github.com/acdlite/flux-standard-action), but does not include a separate method of representing errors.)

Pass your Action Definition into an Action Executor:

```javascript
const createActionExecutor = require('actioneer');

const executor = createActionExecutor({
    resolveFunctionForAction: (action) => require(`./actions/${action.type}`),
    middleware: [
        retryMiddleware(5),
    ],
});

executor(myAction).then(result => {
    console.log('🎷yay! email sent.');
});

```

- `resolveFunctionForAction` resolves your Action Definition into a corresponding function to execute.
- `middleware` is an array of standard middleware to use. More on that in a minute.
- `executor` **always** returns a `Promise`.

### Action Functions

You implement your actual code in an Action Function (better name TBD). It receives your Action Definition (after it is passed through the middleware stack):

```javascript
function myActionFunction(myAction) {
    // TODO: do something cool in here
    return 42;
}
```

Action Functions can:

- return `undefined`
- return a value
- return a `Promise`
- throw an `Error`

If you return a value (or `undefined`) from your Action Function, your Action Executor will return a `Promise` that resolves to that value.
If you return a `Promise`, your Action Executor will return that `Promise`.
If you throw an `Error`, your Action Executor will return a rejected `Promise`.

### Middleware

Middleware is a function that receives two arguments: `action` and `next`.

`next` is a function that will execute the next middleware in the chain (or the Action Function if it's the last middleware in the chain), and return a `Promise`.

Here's a simple middleware that logs before executing an action:

```javascript
function loggingMiddleware(action, next) {
    console.log(`executing ${action.type}`);
    return next();
}
```

Middleware can modify the action before passing it along by passing a modified action into `next()`:

```javascript
function allCapsPayloadMiddleware(action, next) {

    const newPayload = {};
    Object.keys(action.payload).forEach(key => {
        newPayload[key] = action.payload[key].toUpperCase();
    });

    return next({
        type: action.type,
        payload: newPayload,
        meta: action.meta
    });
}

```

It can also modify the result of executing the Action Function:

```javascript
function arrayReversingMiddleware(action, next) {
    return next().then(result => {
        return result.slice(0).reverse();
    });
}

```

You can pass standard middleware into `createActionExecutor`, but you can also apply middleware to an Action Function for one-off cases:

```javascript
const { applyMiddleware} = require('actioneer');

const myActionFunctionWithMiddleware = applyMiddleware(myActionFunction, allCapsPayloadMiddleware, arrayReversingMiddleware);
```

You can now pass an action into `myActionFunctionWithMiddleware()` and it will be passed through `allCapsPayloadMiddleware` and `arrayReversingMiddelware`.

### Included Middleware

- `payloadOnlyMiddleware` - Strips action `type` and `metadata` and forwards only the `payload`. Helpful for simplifying inputs to your functions.
- `returnedActionsMiddleware` - Middleware that detects Actions *returned* by your action executor and does things with them.

### Middleware to Write

- `parallelizingMiddlware` - Middleware that executes other middleware in parallel and merges the resulting actions together for forwarding.
- `retryingMiddleware` - Middleware that retries on error with exponential backoff.

## Examples

_TODO: Provide some examples_

## FAQ

### Why do this? Isn't this just a bunch of fiddly needless boilerplate to execute a function?

Good point! I will delete this immediately.
