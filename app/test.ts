import * as mocha from "mocha";
 
export default class Calculator {
    add(x : number, y : number) : number {
        return 0;
    }
}

describe('Calculator', () => {
    var subject : Calculator;

    beforeEach(function () {
        subject = new Calculator();
    });

    describe('#add', () => {
        it('should add two numbers together', () => {
            var result : number = subject.add(2, 3);
            if (result !== 5) {
                throw new Error('Expected 2 + 3 = 5 but was ' + result);
            }
        });
    });
});