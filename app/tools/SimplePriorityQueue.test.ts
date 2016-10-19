import { SimplePriorityQueue } from "./index";
import { LpaStar } from './../algorithm/LpaStar';

describe("SimplePriorityQueue", () => {
    let subject: SimplePriorityQueue<any, number[]>;

    beforeEach(function () {
        subject =  new SimplePriorityQueue<any, number[]>
                (LpaStar.compareKeys, [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]);
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
