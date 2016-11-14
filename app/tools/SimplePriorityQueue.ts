import * as _ from "lodash";

/**
 * Hacky implementation of a PriorityQueue.
 * I added this to meet the needs of the LPA* algorithm.
 */
export class SimplePriorityQueue<Telement, Tkey> {
    private items: Telement[];
    constructor(private comparator: (a: Tkey, b: Tkey) => number, private defaultKey: Tkey) {
        this.items = new Array();
    }

    public insert(item: Telement, key: Tkey) {
        (item as any).key = key;
        this.items.push(item);
        this.sort();
    }
    public remove(item: Telement) {
        _.remove(this.items, item);
    }

    public has(item: Telement) {
        return _.findIndex(this.items, x => x === item) !== -1;
    }

    public clear(){
      this.items = new Array();
    }

    public topKey() {
        // todo: review this. Can we return [0,0] if list is empty?
        if (this.items[0] !== undefined) {
            return (this.items[0] as any).key;
        } else {
            return this.defaultKey;
        }
    }

    public pop() {
        return this.items.shift();
    }

    public updateKey(item: any, key: Tkey) {
        // quick and dirty solution
        this.remove(item);
        this.insert(item, key);
    }

    public get isEmpty(){
      return this.items.length <= 0;
    }

    private sort() {
        this.items = this.items.sort((a, b) => this.comparator((a as any).key, (b as any).key));
    }
}
