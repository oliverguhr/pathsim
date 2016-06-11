class Distance {
    static manhattan(previousCell, currentCell) {
        return Math.abs(previousCell.position.x - currentCell.position.x) + Math.abs(previousCell.position.y - currentCell.position.y);
    }

    static euklid(previousCell, currentCell) {
      let x = previousCell.position.x - currentCell.position.x;
      let y = previousCell.position.y - currentCell.position.y;
      return  Math.hypot(x,y);//  == Math.sqrt( x*x + y*y );
    }

    static diagonalShortcut(previousCell, currentCell) {
      /* See  http://www.policyalmanac.org/games/heuristics.htm  for details*/
      let xDistance = Math.abs(previousCell.position.x - currentCell.position.x);
      let yDistance = Math.abs(previousCell.position.y - currentCell.position.y);
      if (xDistance > yDistance)
      {
        return  14*yDistance + 10*(xDistance-yDistance);
      }
      else{
        return  14*xDistance + 10*(yDistance-xDistance);
     }
   }
}

class PathAlgorithm{
  constructor(){
    this.distance = Distance.euklid;
  }
  getNeighbors(cell, condition) {

      let neighbors = [];

      this.addCellIfpassable(cell.position.x + 0, cell.position.y - 1,neighbors,condition);
      this.addCellIfpassable(cell.position.x + 0, cell.position.y + 1,neighbors,condition);
      this.addCellIfpassable(cell.position.x + 1, cell.position.y + 0,neighbors,condition);
      this.addCellIfpassable(cell.position.x - 1, cell.position.y + 0,neighbors,condition);

      this.addCellIfpassable(cell.position.x + 1, cell.position.y + 1,neighbors,condition);
      this.addCellIfpassable(cell.position.x - 1, cell.position.y + 1,neighbors,condition);
      this.addCellIfpassable(cell.position.x + 1, cell.position.y - 1,neighbors,condition);
      this.addCellIfpassable(cell.position.x - 1, cell.position.y - 1,neighbors,condition);

      return neighbors;
  }

  addCellIfpassable(x,y,neighbors,condition){
      let cell = this.map.getCell(x, y);
      if (cell !== undefined && condition(cell)) {
          neighbors.push(cell);
      }
  }


  paintShortestPath() {
    /*let node = this.map.getGoalCell().previous;
    while (node !== undefined) {
      if (node.isVisited) {
        node.type = CellType.Current;
        node.color = undefined;
      }
      node = node.previous;
    }*/
    let start = this.map.getStartCell();
    let node = this.map.getGoalCell();
    let nodeDistance = cell => cell.distance ;
    do {
      let predecessors = this.getNeighbors(node, cell => !cell.isBlocked).filter(node => Number.isFinite(node.distance));

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
    } while (node !== start);
  }
}

class Dijkstra extends PathAlgorithm {
    constructor(map) {
        super();
        this.map = map;
        this.cells = [];
        this.initialize();
    }

    initialize() {
        let cells = this.map.cells.filter(cell => !cell.isBlocked);
        for (let cell of cells) {
            cell.previous = undefined;
            cell.distance = Number.POSITIVE_INFINITY;
            this.cells.push(cell);
        }

        this.map.getStartCell().distance = 0;
    }

    run() {
        while (this.step()) {}
    }

    step() {
        let isRunning = true;
        let currentCell = _.minBy(this.cells, c => c.distance);

        if (currentCell.isGoal) {
            this.paintShortestPath();
            return false;
        }

        _.pull(this.cells, currentCell);

        let neighbors = this.getNeighbors(currentCell, cell => !cell.isBlocked && !cell.isVisited);

        for (let neighbor of neighbors) {
            if (isRunning)
                this.updateDistance(currentCell, neighbor);

            if (neighbor.isGoal) {
                this.paintShortestPath();
                isRunning = false;
                break;
            }
        }
        return isRunning;
    }

    updateDistance(previousCell, currentCell) {
        let distance = previousCell.distance + this.distance(previousCell, currentCell);
        if (distance < currentCell.distance) {
            currentCell.distance = distance;
            currentCell.previous = previousCell;
        }
        if (currentCell.isFree) {
            currentCell.type = CellType.Visited;
        }
    }

}
