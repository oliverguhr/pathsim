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
            describe("SimplePriorityQueue for complex keys", () => {
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
            describe("SimplePriorityQueue", () => {
                let subject;
                beforeEach(function () {
                    subject = new index_1.SimplePriorityQueue((a, b) => a - b, 0);
                    subject.insert({ name: "1" }, 1);
                    subject.insert({ name: "2" }, 2);
                    subject.insert({ name: "3" }, 3);
                });
                describe("basic operations", () => {
                    it("has item", () => {
                        let dummy = { name: "dummy" };
                        subject.insert(dummy, 10);
                        if (!subject.has(dummy)) {
                            throw new Error("Item should be in queue.");
                        }
                    });
                    it("pops the right item", () => {
                        if (subject.pop().name != "1")
                            throw new Error("Should return item nr. 1");
                    });
                    it("clears the queue", () => {
                        subject.clear();
                        if (!subject.isEmpty)
                            throw new Error("Queue should be empty");
                    });
                });
            });
        }
    }
});
//# sourceMappingURL=SimplePriorityQueue.test.js.map