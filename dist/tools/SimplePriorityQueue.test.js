System.register(["./index"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var index_1;
    return {
        setters:[
            function (index_1_1) {
                index_1 = index_1_1;
            }],
        execute: function() {
            describe("SimplePriorityQueue", () => {
                let subject;
                beforeEach(function () {
                    subject = new index_1.SimplePriorityQueue();
                });
                describe("basic operations", () => {
                    it("insert item", () => {
                        let dummy = { name: "dummy" };
                        subject.insert(dummy, [1, 1]);
                        if (!subject.has(dummy)) {
                            throw new Error("Item should be in queue.");
                        }
                    });
                });
            });
        }
    }
});
//# sourceMappingURL=SimplePriorityQueue.test.js.map