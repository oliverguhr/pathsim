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

        for (var i = 0; i < cells.length; i++) {
          cells[i].previous = undefined;
          cells[i].distance = Number.POSITIVE_INFINITY;
          cells[i].isOpen = true;
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
        let neighbors =  this.getNeighbors(currentNode)
        for (var i = 0; i < neighbors.length; i++) {
          if (!neighbors[i].isOpen) {
              continue; // Ignore the neighbor which is already evaluated.
          }
          // The distance from start to a neighbor
          let tentative_g = currentNode.distance + this.distanceBetween(neighbors[i],currentNode);

          if (!neighbors[i].isOpen && tentative_g >= neighbors[i].distance) {
              continue; // This is not a better path.
          }
          else if (neighbors[i].isOpen) {
            // This path is the best until now. Record it!
            neighbors[i].previous = currentNode;
            neighbors[i].distance = tentative_g;
            neighbors[i].estimatedDistance = neighbors[i].distance  + this.distanceBetween(this.goal,neighbors[i]);
            this.openCells.queue(neighbors[i]);
            if (neighbors[i].isFree) {
                neighbors[i].type = CellType.Visited;
            }
          }
        }              
    }
    distanceBetween(successor,currentNode) {
        return Distance.euklid(currentNode,successor); //todo: do something that makes sense..
    }

}
