"use strict";
class Calculator {
    add(x, y) {
        return 0;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Calculator;
describe('Calculator', () => {
    var subject;
    beforeEach(function () {
        subject = new Calculator();
    });
    describe('#add', () => {
        it('should add two numbers together', () => {
            var result = subject.add(2, 3);
            if (result !== 5) {
                throw new Error('Expected 2 + 3 = 5 but was ' + result);
            }
        });
    });
});
//# sourceMappingURL=test.js.map