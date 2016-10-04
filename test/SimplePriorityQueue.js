"use strict";
const _ = require("lodash");
class SimplePriorityQueue {
    constructor() {
        this.items = new Array();
    }
    insert(item, key) {
        item.key = key;
        this.items.push(item);
        this.sort();
    }
    remove(item) {
        _.remove(this.items, item);
    }
    has(item) {
        return _.findIndex(this.items, x => x === item) !== -1;
    }
    topKey() {
        if (this.items[0] !== undefined) {
            return this.items[0].key;
        }
        else {
            return [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY];
        }
    }
    pop() {
        return this.items.shift();
    }
    updateKey(item, key) {
        this.remove(item);
        this.insert(item, key);
    }
    sort() {
        this.items = this.items.sort(function (a, b) {
            if (a.key[0] > b.key[0]) {
                return 1;
            }
            else if (a.key[0] < b.key[0]) {
                return -1;
            }
            else {
                if (a.key[1] > b.key[1]) {
                    return 1;
                }
                if (a.key[1] < b.key[1]) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
        });
    }
}
exports.SimplePriorityQueue = SimplePriorityQueue;
//# sourceMappingURL=SimplePriorityQueue.js.map