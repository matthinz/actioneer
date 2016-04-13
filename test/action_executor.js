const { expect } = require('chai');
const SRC_DIR = '../src';

const { createActionExecutor } = require(`${SRC_DIR}/action_executor`);

describe('createActionExecutor()', () => {
    describe('resolveFunctionForAction', () => {
        it('is required', () => {
            expect(() => {
                createActionExecutor();
            }).to.throw(TypeError, /resolveFunctionForAction/);
        });
        it('can throw an error and reject Promise');
        it('must return a function');
    });
    describe('middleware', () => {
        it('can be missing', () => {
            const executor = createActionExecutor({
                resolveFunctionForAction() { },
            });
            expect(executor).to.be.a.function;
        });
        it('can be an empty array', () => {
            const executor = createActionExecutor({
                resolveFunctionForAction() { },
                middleware: [],
            });
            expect(executor).to.be.a.function;
        });
        it('can be an array');
    });
});
