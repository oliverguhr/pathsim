System.register(["./index", './../algorithm/LpaStar'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var index_1, LpaStar_1;
    return {
        setters:[
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (LpaStar_1_1) {
                LpaStar_1 = LpaStar_1_1;
            }],
        execute: function() {
            describe("SimplePriorityQueue", () => {
                let subject;
                beforeEach(function () {
                    subject = new index_1.SimplePriorityQueue(LpaStar_1.LpaStar.compareKeys, [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]);
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