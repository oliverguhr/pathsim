System.register(["./../grid/index", "./TypedDictonary"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var index_1, TypedDictonary_1;
    return {
        setters:[
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (TypedDictonary_1_1) {
                TypedDictonary_1 = TypedDictonary_1_1;
            }],
        execute: function() {
            describe("TypMappedDictonary", () => {
                let subject;
                beforeEach(function () {
                    let mapping = (position) => { return position.x + position.y; };
                    subject = new TypedDictonary_1.TypMappedDictionary(mapping);
                });
                describe("basic operations", () => {
                    it("insert item", () => {
                        let dummy = new index_1.Position(10, 21);
                        subject.set(dummy, 1337);
                        if (subject.get(dummy) !== 1337) {
                            throw new Error("Item should be in dictonary.");
                        }
                    });
                });
            });
        }
    }
});
//# sourceMappingURL=TypedDictonary.test.js.map