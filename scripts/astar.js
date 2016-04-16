class AStar extends PathAlgorithm {
    constructor(map) {
        super();
        let queueConfig = {
            comparator: (a, b) => a.estimatedDistance - b.estimatedDistance
        };

        this.map = map;
        this.openCells = new PriorityQueue(queueConfig);
        this.closedCells = [];
        this.goal = this.map.getGoalCell();
        this.initialize();
    }
    initialize() {
        let cells = this.map.cells.filter(cell => !cell.isBlocked);
        for (let cell of cells) {
            cell.previous = undefined;
            cell.distance = Number.POSITIVE_INFINITY;
            cell.isOpen = true;
        }

        let start = this.map.getStartCell();
        start.distance = 0;
        start.estimatedDistance = this.distanceBetween(start, this.goal);
        this.openCells.queue(start);
    }

    run() {
        while (this.step()) {}
    }

    step() {
        if (this.openCells.length !== 0) {
            let currentNode = this.openCells.dequeue();

            if (currentNode.isGoal) {
                this.paintShortestPath();
                return false;
            }

            currentNode.isOpen = false;
            //this.closedCells.push(currentNode); //todo, may we don't need this

            this.expendNode(currentNode);
            return true;
        }
        return false;
    }

    expendNode(currentNode) {
        for (let successor of this.getNeighbors(currentNode)) {
            if (!successor.isOpen) {
                continue; // Ignore the neighbor which is already evaluated.
            }
            // The distance from start to a neighbor
            let tentative_g = currentNode.distance + this.distanceBetween(successor,currentNode);

            if (!successor.isOpen && tentative_g >= neighbor.distance) {
                continue; // This is not a better path.
            }
            else if (successor.isOpen) {
              // This path is the best until now. Record it!
              successor.previous = currentNode;
              successor.distance = tentative_g;
              successor.estimatedDistance = successor.distance  + this.distanceBetween(this.goal,successor);
              this.openCells.queue(successor);
              if (successor.isFree) {
                  successor.type = CellType.Visited;
              }
            }
        }
    }
    distanceBetween(successor,currentNode) {
        return Distance.manhattan(successor,currentNode); //todo: do something that makes sense..
    }

}
