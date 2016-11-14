import { Position } from "./../grid/index";
import { TypMappedDictionary } from "./index";

describe("TypMappedDictonary", () => {
    let subject: TypMappedDictionary<Position, number>;
    let mapping = (position: Position) => { return position.x + position.y; };
    beforeEach(function () {
        // You would not use this mapping in a real case, 
        // but it keeps the testcase small.        
        subject = new TypMappedDictionary<Position, number>(mapping);
    });

    describe("an existing index", () => {
        it("should return the stored data", () => {
            let dummy = new Position(10, 21);
            subject.set(dummy, 1337);
            subject.set(new Position(10, 22), 1338);
            if (subject.get(dummy) !== 1337) {
                throw new Error("Item should be in dictonary.");
            }
        });
    });

    describe("a get on a deleted index", () => {
        it("should return undefined", () => {
            let dummy = new Position(10, 21);
            subject.set(dummy, 1337);
            subject.delete(dummy);
            if (subject.get(dummy) !== undefined) {
                throw new Error("Item should be undefined.");
            }
        });
        it("should return the default value if it is set", () => {
            subject = new TypMappedDictionary<Position, number>(mapping, 0);
            let dummy = new Position(10, 21);
            subject.set(dummy, 1337);
            subject.delete(dummy);
            if (subject.get(dummy) !== 0) {
                throw new Error("It should return 0.");
            }
        });
    });

    describe("the converted dictionary", () => {
        it("should contain the elements", () => {
            subject.set(new Position(0, 1), 10);
            subject.set(new Position(0, 2), 20);
            subject.set(new Position(0, 3), 30);

            let test1 = subject.dictionary.find(value => value[0] === 1 && value[1] === 10);
            let test2 = subject.dictionary.find(value => value[0] === 2 && value[1] === 20);
            let test3 = subject.dictionary.find(value => value[0] === 3 && value[1] === 30);

            if (!(test1 && test2 && test3)) {
                throw new Error("Array did not contain all the elements");
            }
        });
    });
});
