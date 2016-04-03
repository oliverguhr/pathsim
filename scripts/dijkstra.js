class Dijkstra {
    constructor(map) {
        this.map = map;
        this.cells = [];
        this.initialize();
    }

    initialize() {
        for (let cell of this.map.cells) {
            cell.distance = Number.POSITIVE_INFINITY;
            cell.previous = undefined;
            this.cells.push(cell);
        }

        this.map.getStartCell().distance = 0;
    }

    run() {
        do {
            let nearestCell = _.minBy(this.cells, c => c.distance);
            _.pull(this.cells, nearestCell);

            let neighbors = this.getNeighbors(nearestCell);

            neighbors.forEach(nextCell => this.updateDistance(nearestCell, nextCell));
        }
        while (!_.isEmpty(this.cells))
        this.paintShortestPath();
    }

    getNeighbors(cell) {

        let neighbors = [];
        let map = this.map;

        let useIfFree = (x, y) => {
            let cell = map.getCell(x, y);
            if (cell != undefined && !cell.isBlocked) {
                neighbors.push(cell);
            }
        }

        /*     useIfFree(cell.position.x + 1, cell.position.y + 1);
             useIfFree(cell.position.x - 1, cell.position.y + 1);
             useIfFree(cell.position.x + 1, cell.position.y - 1);
             useIfFree(cell.position.x - 1, cell.position.y - 1);*/
        useIfFree(cell.position.x + 0, cell.position.y + 1);
        useIfFree(cell.position.x + 0, cell.position.y - 1);
        useIfFree(cell.position.x + 1, cell.position.y + 0);
        useIfFree(cell.position.x - 1, cell.position.y + 0);

        return neighbors;
    }

    updateDistance(previousCell, currentCell) {
        let distance = previousCell.distance + 1;
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