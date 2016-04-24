class LpaStar extends PathAlgorithm {
  constructor(map) {
    super();
    this.isActive = true;

    this.map = map;
    this.openCells = new SimplePriorityQueue();

    this.goal = this.map.getGoalCell();
    this.start = this.map.getStartCell();
  }

  calcKey(cell) {
    let k2 = Math.min(cell.g, cell.rhs);
    let k1 = k2 + this.distance(cell, this.goal);
    let key = [k1, k2];
    return key;
  }

  initialize() {
    let cells = this.map.cells.filter(cell => !cell.isBlocked);

    for (var i = 0; i < cells.length; i++) {
      cells[i].previous = undefined;
      cells[i].g = Number.POSITIVE_INFINITY; // distance?
      cells[i].rhs = Number.POSITIVE_INFINITY; // distance?
    }
    this.start.rhs = 0;
    this.openCells.insert(this.start, this.calcKey(this.start));
  }

  getPredecessors(cell) {
    return this.map.cells.filter(c => c.previous == cell);
  }

  updateVertex(cell) {
      if (cell !== this.start) {
        //this could be done by a reduce function
        let comperer = function(predecessor) {
          return predecessor.g + this.distance(predecessor, cell);
        };

        cell.rhs = _.sortBy(this.getPredecessors(cell), comperer).reverse().pop();
      }
      if (this.openCells.has(cell)) {
        this.openCells.remove(cell);
      }

      if (cell.g !== cell.rhs) {
        this.openCells.insert(cell, this.calcKey(this.start));
      }
    }
    //find a shortest path from the start to the goal
  computeSortestPath() {
    while (this.openCells.topKey() < this.calcKey(this.goal) ||
      this.goal.g !== this.goal.rhs) {
      let item = this.openCells.pop();
      if (item.g > item.rhs) {
        item.g = item.rhs;
      } else {
        item.g = Number.POSITIVE_INFINITY;
        this.updateVertex(item);
      }
      this.getNeighbors(item).forEach(x => this.updateVertex(x));
    }
  }

  main() {
    this.initialize();
    this.computeSortestPath();
    return;

    while (isActive) {
      this.computeSortestPath();
      //wait for changes in edge costs
      //
    }
  }
}

// (start distance, start infinity)rhs, min from predecessors where (g(current) + c(current,previous))
//(Distance, start infinity) g value = distance from start
//heuristic h(s,sgoal)
//
