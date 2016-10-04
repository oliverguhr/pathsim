System.register(['./SimplePriorityQueue'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SimplePriorityQueue_1;
    return {
        setters:[
            function (SimplePriorityQueue_1_1) {
                SimplePriorityQueue_1 = SimplePriorityQueue_1_1;
            }],
        execute: function() {
            describe('SimplePriorityQueue', () => {
                let subject;
                beforeEach(function () {
                    subject = new SimplePriorityQueue_1.SimplePriorityQueue();
                });
                describe('#basic operations', () => {
                    it('insert item', () => {
                        var dummy = { name: 'dummy' };
                        var result = subject.insert(dummy, [1, 1]);
                        if (!subject.has(dummy)) {
                            throw new Error('Item should be in queue.');
                        }
                    });
                });
            });
        }
    }
});
//# sourceMappingURL=SimplePriorityQueue.test.js.map