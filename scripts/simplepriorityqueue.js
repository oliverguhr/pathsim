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
    return _.findIndex(this.items, x => x === item) !== -1;
  }

  topKey() {
    //todo: review this. Can we return [0,0] if list is empty?
    if(this.items[0] !== undefined){
      return this.items[0].key;
    }
    else {
      throw new Error("List is empty");
    }
  }

  pop() {
    return this.items.shift();
  }

  updateKey(item, key){
    //quick and dirty solution
    this.remove(item);
    this.insert(item,key);
  }

}
