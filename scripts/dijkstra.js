class Dijkstra {
    constructor(map) {
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
        /*  do {
              let nearestCell = _.minBy(this.cells, c => c.distance);
              _.pull(this.cells, nearestCell);

              let neighbors = this.getNeighbors(nearestCell);

              neighbors.forEach(nextCell => this.updateDistance(nearestCell, nextCell));
          }
          while (!_.isEmpty(this.cells))
          this.paintShortestPath();*/

        while (this.step()) {

        }
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

    getNeighbors(cell) {

        let neighbors = [];
        let map = this.map;

        let useIfFree = (x, y) => {
            let cell = map.getCell(x, y);
            if (cell !== undefined && (cell.isFree || cell.isGoal)) {
                neighbors.push(cell);
            }
        }

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

    updateDistance(previousCell, currentCell) {
        let manhattanDistance = Math.abs(previousCell.position.x - currentCell.position.x) + Math.abs(previousCell.position.y - currentCell.position.y);
        let distance = previousCell.distance + manhattanDistance;
        if (distance < currentCell.distance) {
            currentCell.distance = distance;
            currentCell.previous = previousCell;

        }
        if (currentCell.isFree) {
            currentCell.type = CellType.Visited;
        }

    }

    paintShortestPath() {
        let node = this.map.getGoalCell().previous;
        while (node != undefined) {
            if (node.isVisited) {
                node.type = CellType.Current;
            }
            node = node.previous;
        }

    }
}