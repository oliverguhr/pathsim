System.register(["lodash"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _;
    var SimplePriorityQueue;
    return {
        setters:[
            function (_1) {
                _ = _1;
            }],
        execute: function() {
            class SimplePriorityQueue {
                constructor(comparator, defaultKey) {
                    this.comparator = comparator;
                    this.defaultKey = defaultKey;
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
                clear() {
                    this.items = new Array();
                }
                topKey() {
                    if (this.items[0] !== undefined) {
                        return this.items[0].key;
                    }
                    else {
                        return this.defaultKey;
                    }
                }
                pop() {
                    return this.items.shift();
                }
                updateKey(item, key) {
                    this.remove(item);
                    this.insert(item, key);
                }
                get isEmpty() {
                    return this.items.length <= 0;
                }
                sort() {
                    this.items = this.items.sort((a, b) => this.comparator(a.key, b.key));
                }
            }
            exports_1("SimplePriorityQueue", SimplePriorityQueue);
        }
    }
});
//# sourceMappingURL=SimplePriorityQueue.js.map