import * as _ from "lodash";

export class SimplePriorityQueue {
    items:any[];
    constructor() {
        this.items = new Array();
    }

    insert(item:any, key:Array<number>) {
        item.key = key;
        this.items.push(item);
        this.sort();
    }
    remove(item:any) {
        _.remove(this.items, item);
    }

    has(item:any) {
        return _.findIndex(this.items, x => x === item) !== -1;
    }

    topKey() {
        //todo: review this. Can we return [0,0] if list is empty?
        if (this.items[0] !== undefined) {
            return this.items[0].key;
        } else {
            return [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY];
        }
    }

    pop() {
        return this.items.shift();
    }

    updateKey(item:any, key:Array<number>) {
        //quick and dirty solution
        this.remove(item);
        this.insert(item, key);
    }

    sort() {
        this.items = this.items.sort(function(a, b) {
            if (a.key[0] > b.key[0]) {
                return 1;
            } else if (a.key[0] < b.key[0]) {
                return -1;
            } else {
                if (a.key[1] > b.key[1]) {
                    return 1;
                }
                if (a.key[1] < b.key[1]) {
                    return -1;
                } else {
                    return 0;
                }
            }
        });
    }
}
