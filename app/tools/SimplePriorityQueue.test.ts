import { SimplePriorityQueue } from "./index";
import { LpaStar } from './../algorithm/LpaStar';

describe("SimplePriorityQueue for complex keys", () => {
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

describe("SimplePriorityQueue", () => {
    let subject: SimplePriorityQueue<any, number>;

    beforeEach(function () {
        subject =  new SimplePriorityQueue<any, number>((a,b) => a-b, 0);
        subject.insert({name:"1"},1);
        subject.insert({name:"2"},2);
        subject.insert({name:"3"},3);
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
            if(subject.pop().name != "1") throw new Error("Should return item nr. 1");
        });
        it("clears the queue", () => {
            subject.clear();
            if(!subject.isEmpty) throw new Error("Queue should be empty");
        });
    });
});
