class Distance {
    static manhattan(previousCell, currentCell) {
        return Math.abs(previousCell.position.x - currentCell.position.x) + Math.abs(previousCell.position.y - currentCell.position.y);
    }

    static euklid(previousCell, currentCell) {
      let x = previousCell.position.x - currentCell.position.x;
      let y = previousCell.position.y - currentCell.position.y;
      return Math.sqrt( x*x + y*y );
    }
}

class PathAlgorithm{
  getNeighbors(cell) {

      let neighbors = [];
      let map = this.map;

      let useIfFree = (x, y) => {
          let cell = map.getCell(x, y);
          if (cell !== undefined && (cell.isFree || cell.isGoal)) {
              neighbors.push(cell);
          }
      };

      useIfFree(cell.position.x + 1, cell.position.y + 0);
      useIfFree(cell.position.x + 0, cell.position.y + 1);
      useIfFree(cell.position.x + 0, cell.position.y - 1);
      useIfFree(cell.position.x - 1, cell.position.y + 0);

      useIfFree(cell.position.x + 1, cell.position.y + 1);
      useIfFree(cell.position.x - 1, cell.position.y + 1);
      useIfFree(cell.position.x + 1, cell.position.y - 1);
      useIfFree(cell.position.x - 1, cell.position.y - 1);

      return neighbors;
  }
  paintShortestPath() {
    let node = this.map.getGoalCell().previous;
    while (node !== undefined) {
      if (node.isVisited) {
        node.type = CellType.Current;
        node.color = undefined;
      }
      node = node.previous;
    }
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

        let neighbors = this.getNeighbors(currentCell);

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
        let distance = previousCell.distance + Distance.euklid(previousCell, currentCell);
        if (distance < currentCell.distance) {
            currentCell.distance = distance;
            currentCell.previous = previousCell;
        }
        if (currentCell.isFree) {
            currentCell.type = CellType.Visited;
        }
    }

}
