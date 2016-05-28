//an attempt to implement D* Lite in its optimizied version
class DStarLite extends PathAlgorithm {
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
      //g is the cost so far from the start node to the current node
      cells[i].g = Number.POSITIVE_INFINITY;
      /*
        Right Hand Side value
        is equal to the cost(g value) of the parent of a node plus
        the cost to travel to that node.
      */
      cells[i].rhs = Number.POSITIVE_INFINITY;
    }
    this.start.rhs = 0;
    this.openCells.insert(this.start, this.calcKey(this.start));
  }

  getPredecessors(cell) {
    return this.map.cells.filter(c => c.previous == cell);
  }

  updateVertex(cell) {
      if (cell.g !== cell.rhs && this.openCells.has(cell)) {
        this.openCells.updateKey(cell,this.calcKey(cell));
      }
      else if (cell.g !== cell.rhs && !this.openCells.has(cell)) {
        this.openCells.insert(cell,this.calcKey(cell));
      }
      else if (cell.g === cell.rhs && this.openCells.has(cell)) {
        this.openCells.remove(cell);
      }
    }
    //find a shortest path from the start to the goal
  computeSortestPath() {
    while (this.openCells.topKey() < this.calcKey(this.goal) ||
      this.goal.g !== this.goal.rhs) {
      let item = this.openCells.pop();
      if (item.g > item.rhs) {
        item.g = item.rhs;
        this.openCells.remove(item);
        this.getNeighbors(item).forEach(neighbor => {
          if(neighbor !== this.start)
          {
              neighbor.rhs = Math.min(neighbor.rhs,item.g + this.distance(item,neighbor));
          }
          this.updateVertex(neighbor);
        });

      } else {
        let gOld = item.g;
        item.g = Number.POSITIVE_INFINITY;
        let neighbors = this.getNeighbors(item);
        neighbors.push(item);
        for(let neighbor of neighbors)
        {
            if(neighbor.rhs == gOld +this.distance(item,neighbor) || neighbor ===item )
            {
              if(neighbor !== this.start)
              {
                neighbor.rhs = neighbor.previous.g + this.distance(neighbor.previous,neighbor);
              }
            }
            this.updateVertex(neighbor);
        }
      }
    }
  }

  main() {
    this.initialize();
    this.computeSortestPath();
    return;  
  }
}

// (start distance, start infinity)rhs, min from predecessors where (g(current) + c(current,previous))
//(Distance, start infinity) g value = distance from start
//heuristic h(s,sgoal)
//
