System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Calculator;
    return {
        setters:[],
        execute: function() {
            class Calculator {
                add(x, y) {
                    return 0;
                }
            }
            exports_1("default", Calculator);
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
        }
    }
});
//# sourceMappingURL=test.js.map