const { expect, assert } = require('chai');
const SRC_DIR = '../../src';

const { createReturnedActionsMiddleware } = require(`${SRC_DIR}/middleware/returned_actions`);
const { applyMiddleware } = require(`${SRC_DIR}/apply_middleware`);

describe('returnedActionsMiddleware', () => {
    'use strict';

    const goodActionToReturn = {
        type: 'returned_action',
        payload: {
            foo: 'bar',
        },
    };

    it('detects a returned action', () => {
        let detected = 0;
        const middleware = createReturnedActionsMiddleware((action) => {
            expect(action).to.equal(goodActionToReturn);
            detected++;
        });

        const func = applyMiddleware(() => goodActionToReturn, middleware);

        return func({ type: 'some_action' }).then(() => {
            expect(detected).to.equal(1);
        });
    });

    it('lets non-action result through', () => {
        const middleware = createReturnedActionsMiddleware(() => {
            assert(false, 'should not detect any actions');
        });
        const func = applyMiddleware(() => ({ foo: 'bar' }), middleware);
        return func({ type: 'some_action' });
    });

    it('detects Array of actions returned');
    it('lets Array of non-actions through');
    it('lets Array of some actions and some non-actions through');
});
