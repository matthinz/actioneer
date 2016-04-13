const { expect, assert } = require('chai');
const SRC_DIR = '../src';

const { applyMiddleware } = require(`${SRC_DIR}/apply_middleware`);

function nullMiddleware(action, next) {
    return next();
}

function squashErrorsMiddleware(action, next) {
    return next().catch(err => {
        if (err.code !== 'ETEST') {
            throw err;
        }
        return action;
    });
}

function throwingMiddleware() {
    const err = new Error('An error.');
    err.code = 'ETEST';
    throw err;
}

describe('applyMiddleware()', () => {
    'use strict';

    const ogAction = {
        type: 'foo',
        payload: {
            bar: 'baz',
        },
    };

    let assertUnchangedActionCalled;
    function assertUnchangedAction(action) {
        expect(action).to.equal(ogAction);
        assertUnchangedActionCalled = true;
    }

    function run(func) {
        const promise = func(ogAction);
        expect(promise).to.be.an.instanceOf(Promise);
        return promise.then(() => {
            assert(assertUnchangedActionCalled, 'assertUnchangedAction was called');
        });
    }

    beforeEach(() => { assertUnchangedActionCalled = false; });

    it('handles middleware not doing anything', () => {
        const func = applyMiddleware(
            assertUnchangedAction,
            nullMiddleware
        );
        return run(func);
    });

    it('handles middleware throwing exceptions', () => {
        const func = applyMiddleware(
            assertUnchangedAction,
            throwingMiddleware
        );

        return run(func)
            .then(() => { assert(false, 'should not succeed'); })
            .catch(err => {
                if (err.code !== 'ETEST') {
                    throw err;
                }
            });
    });

    it('lets middleware squash exceptions', () => {
        const func = applyMiddleware(
            assertUnchangedAction,
            squashErrorsMiddleware,
            throwingMiddleware
        );
        return func(ogAction).then(action => {
            expect(action).to.equal(ogAction);
            expect(assertUnchangedActionCalled).to.be.false;
        });
    });

    it('detects when middleware does not return a Promise', () => {
        const func = applyMiddleware(
            assertUnchangedAction,
            () => {}
        );

        return func(ogAction)
            .then(() => assert(false, 'should not succeed'))
            .catch(err => {
                if (err.code !== 'EBADMIDDLEWARE') {
                    throw err;
                }
            });
    });
});
