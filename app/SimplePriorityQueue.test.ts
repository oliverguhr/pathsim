import { SimplePriorityQueue } from "./SimplePriorityQueue";


describe("SimplePriorityQueue", () => {
    let subject: SimplePriorityQueue;

    beforeEach(function () {
        subject = new SimplePriorityQueue();
    });

    describe("#basic operations", () => {
        it("insert item", () => {
            let dummy = { name: "dummy" };
            subject.insert(dummy, [1, 1]);
            if (!subject.has(dummy)) {
                throw new Error("Item should be in queue.");
            }
        });
    });
});
