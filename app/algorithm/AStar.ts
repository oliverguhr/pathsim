import {Cell,Map, CellType} from '../Grid/index';
import {PathAlgorithm} from './PathAlgorithm';
import * as PriorityQueue from "js-priority-queue";

export class AStar extends PathAlgorithm {
    private goal:Cell;
    private start:Cell;
    private openCells:PriorityQueue<Cell>;

    constructor(map:Map) {
        super();
        let queueConfig = {
            comparator: (a, b) => a.estimatedDistance - b.estimatedDistance
        };
        this.map = map;
        this.openCells = new PriorityQueue<Cell>(queueConfig);
        this.goal = this.map.getGoalCell();
        this.start = this.map.getStartCell();
        this.initialize();
    }
    initialize() {
        let cells = this.map.cells.filter(cell => !cell.isBlocked);

        for (var i = 0; i < cells.length; i++) {
            cells[i].previous = undefined;
            cells[i].distance = Number.POSITIVE_INFINITY;
            cells[i].isOpen = true;
        }

        this.start.distance = 0;
        this.start.estimatedDistance = this.distance(this.start, this.goal);
        this.openCells.queue(this.start);
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

            this.expendNode(currentNode);
            return true;
        }
        return false;
    }

    expendNode(currentNode:Cell) {
        let neighbors = this.getNeighbors(currentNode, cell => !cell.isBlocked /*todo && !cell.isVisited */ );
        for (var i = 0; i < neighbors.length; i++) {
            if (!neighbors[i].isOpen) {
                continue; // Ignore the neighbor which is already evaluated.
            }
            // The distance from start to a neighbor
            let tentative_g = currentNode.distance + this.distance(neighbors[i], currentNode);

            if (tentative_g >= neighbors[i].distance) {
                continue; // This is not a better path.
            } else {
                // This path is the best until now. Record it!
                neighbors[i].previous = currentNode;
                neighbors[i].distance = tentative_g;
                neighbors[i].estimatedDistance = neighbors[i].distance + this.distance(this.goal, neighbors[i]);
                this.openCells.queue(neighbors[i]);
                if (neighbors[i].isFree) {
                    neighbors[i].type = CellType.Visited;
                }
            }
        }
    }
}
