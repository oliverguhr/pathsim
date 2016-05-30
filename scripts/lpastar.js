//todo: Blocked Cells distance values to infinity
//todo: Doppel Key vergleich

class LpaStar extends PathAlgorithm {
  constructor(map) {
    super();
    this.isInitialized = false;

    this.map = map;
    this.openCells = new SimplePriorityQueue();

    this.goal = this.map.getGoalCell();
    this.start = this.map.getStartCell();
  }

  calcKey(cell) {
    let k2 = Math.min(cell.distance, cell.rhs);
    let k1 = k2 + this.distance(cell, this.goal);
    let key = [k1, k2];
    return key;
  }

  //this method defines the neighbors rules, it is used by the getNeighbors function
  addCellIfpassable(x,y,neighbors){
        let cell = this.map.getCell(x, y);
        if (cell !== undefined && (cell.isFree || cell.isGoal || cell.isStart || cell.isVisited)) {
            neighbors.push(cell);
        }
  }

  initialize() {
    let cells = this.map.cells.filter(cell => !cell.isBlocked);

    for (var i = 0; i < cells.length; i++) {
      //distance or g (in the lpa paper) is the cost so far from the start node to the current node
      cells[i].distance = Number.POSITIVE_INFINITY;
      /*
        Right Hand Side value:
        is equal to the minimum cost(g value) of the parents of a node plus
        the cost to travel to that node. You can also call this one-step-lookahead value
      */
      cells[i].rhs = Number.POSITIVE_INFINITY;
    }
    this.start.rhs = 0;
    this.openCells.insert(this.start, this.calcKey(this.start));
  }

  updateVertex(cell) {
      if (cell !== this.start) {

        let predecessorsRhsValues = this.getNeighbors(cell).map(x => x.distance +this.distance(x,cell));

        cell.rhs = Math.min(...predecessorsRhsValues);
        //console.log("Cell ["+cell.position.x+","+cell.position.y +"] rhs= "+cell.rhs +" g= "+cell.distance+ " width key " + this.calcKey(cell));
      }
      if (this.openCells.has(cell)) {
        this.openCells.remove(cell);
      }
      if (cell.distance !== cell.rhs) {
        this.openCells.insert(cell,this.calcKey(cell));
        //console.log("Adding Cell x="+cell.position.x+" y="+cell.position.y );
      }

      //just to visualize the progress
  /*    if(!(cell.isGoal || cell.isStart))
        cell.type = CellType.Visited;*/
    }
    //find a shortest path from the start to the goal
  computeShortestPath() {

    while (this.openCells.topKey() < this.calcKey(this.goal) ||
      this.goal.distance!== this.goal.rhs) {
      let item = this.openCells.pop();
      //console.log("compute node"+ item.toString());
      if (item.distance> item.rhs) {
        item.distance= item.rhs;
        this.getNeighbors(item).forEach(x => this.updateVertex(x));

      } else {
        item.distance= Number.POSITIVE_INFINITY;
        let itemAndNeighbors = this.getNeighbors(item);
        itemAndNeighbors.push(item);
        itemAndNeighbors.forEach(x => this.updateVertex(x));
      }
    }
  }

  paintShortestPath() {
    if(!Number.isFinite(this.goal.distance))    {
       return; // lpa* did not found a path
    }
    this.map.cells.forEach(cell => {
      if(Number.isFinite(cell.distance) && cell.isFree){
              cell.type = CellType.Visited;
      }
    });

    let node = this.goal;
    let nodeDistance = cell => cell.distance + this.distance(node,cell);
    do {
      let predecessors = this.getNeighbors(node).filter(node => Number.isFinite(node.distance));

      if(predecessors.length === 0){ //deadend
        console.log("path is blocked");
        break;
      }

      node = _.minBy(predecessors, nodeDistance);
      if (node.isVisited) {
        node.type = CellType.Current;
        node.color = undefined;
      }
      //console.log("paint node"+ node.toString());
    } while (node !== this.start);
  }

  run() {
    this.initialize();
    this.computeShortestPath();
    this.paintShortestPath();
    this.isInitialized = true;
  }

//this relates to line 20 to 23 within [aij04]
  mapUpdate(cells){
      // {21} all directed edges (u, v) with changed edge costs [aij04]
      let updateList = cells.map(cell =>  this.getNeighbors(cell));
      updateList = _.uniqBy(...updateList, x => x.position);

      cells.filter(x => x.isFree).forEach(x => updateList.push(x));

      updateList.forEach(cell => this.updateVertex(cell));

      this.computeShortestPath();
      this.paintShortestPath();
  }
}

// (start distance, start infinity)rhs, min from predecessors where (g(current) + c(current,previous))
//(Distance, start infinity) g value = distance from start
//heuristic h(s,sgoal)
//
