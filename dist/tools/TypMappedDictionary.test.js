System.register(["./../grid/index", "./index"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var index_1, index_2;
    return {
        setters:[
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (index_2_1) {
                index_2 = index_2_1;
            }],
        execute: function() {
            describe("TypMappedDictonary", () => {
                let subject;
                let mapping = (position) => { return position.x + position.y; };
                beforeEach(function () {
                    subject = new index_2.TypMappedDictionary(mapping);
                });
                describe("an existing index", () => {
                    it("should return the stored data", () => {
                        let dummy = new index_1.Position(10, 21);
                        subject.set(dummy, 1337);
                        if (subject.get(dummy) !== 1337) {
                            throw new Error("Item should be in dictonary.");
                        }
                    });
                });
                describe("a get on a deleted index", () => {
                    it("should return undefined", () => {
                        let dummy = new index_1.Position(10, 21);
                        subject.set(dummy, 1337);
                        subject.delete(dummy);
                        if (subject.get(dummy) !== undefined) {
                            throw new Error("Item should be undefined.");
                        }
                    });
                    it("should return the default value if it is set", () => {
                        subject = new index_2.TypMappedDictionary(mapping, 0);
                        let dummy = new index_1.Position(10, 21);
                        subject.set(dummy, 1337);
                        subject.delete(dummy);
                        if (subject.get(dummy) !== 0) {
                            throw new Error("It should return 0.");
                        }
                    });
                });
            });
        }
    }
});
//# sourceMappingURL=TypMappedDictionary.test.js.map