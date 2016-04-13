const { expect } = require('chai');
const SRC_DIR = '../../src';
const { payloadOnlyMiddleware } = require(`${SRC_DIR}/middleware/payload_only`);

describe('payloadOnlyMiddleware', () => {
    it('does what it says on the tin', (done) => {
        const action = {
            type: 'payload_only_test',
            payload: {
                foo: 'bar',
            },
        };

        function next(a) {
            expect(a).to.equal(action.payload);
            done();
        }

        payloadOnlyMiddleware(action, next);
    });
});
