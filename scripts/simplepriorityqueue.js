class SimplePriorityQueue {
  constructor() {
    this.items = [];
  }

  insert(item, key) {
    item.key = key;
    let index = _.sortedIndexBy(this.items, item, 'key');
    if (index === 0) {
      this.items.unshift(item);
    } else {
      this.items.splice(index, 0, item);
    }
  }
  remove(item) {
    _.remove(this.items, item);
  }

  has(item) {
    return _.findIndex(this.items, x = x === item) !== -1;
  }

  topKey() {
    return this.items[0].key;
  }

  pop() {
    return this.items.shift();
  }

}
