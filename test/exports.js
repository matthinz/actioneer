const { expect } = require('chai');

function check(obj) {
    Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (typeof value === obj) {
            describe(key, () => check(value));
        } else {
            it(key, () => {
                expect(value).to.be.a.function;
            });
        }
    });
}

describe('exports', () => {
    check(require('../index.js'));
});
