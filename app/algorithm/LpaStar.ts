import { Cell, Map, CellType } from "../grid/index";
import { PathAlgorithm } from "./PathAlgorithm";
import { SimplePriorityQueue } from "../tools/index";
import * as _ from "lodash";

// todo: Blocked Cells distance values to infinity
// todo: Doppel Key vergleich

export class LpaStar extends PathAlgorithm {
    /*
          Returns:
            1 if a > b
            0 if a == b
            -1 if a < b
    */
    public static compareKeys(a: Array<number>, b: Array<number>) {
        if (a[0] > b[0]) {
            return 1;
        } else if (a[0] < b[0]) {
            return -1;
        } else {
            if (a[1] > b[1]) {
                return 1;
            }
            if (a[1] < b[1]) {
                return -1;
            } else {
                return 0;
            }
        }
    }


    private isInitialized: boolean;
    private openCells: SimplePriorityQueue<Cell, number[]>;
    private goal: Cell;
    private start: Cell;

    constructor(map: Map) {
        super();
        this.isInitialized = false;

        this.map = map;
        this.openCells =
            new SimplePriorityQueue<Cell, number[]>
                (LpaStar.compareKeys, [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]);

        this.goal = this.map.getGoalCell();
        this.start = this.map.getStartCell();
    }

    public initialize() {
        let cells = this.map.cells;

        for (let i = 0; i < cells.length; i++) {
            // distance or g (in the lpa paper) is the cost so far from the start node to the current node
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

    public run() {
        this.initialize();
        this.computeShortestPath();
        this.paintShortestPath();
        this.isInitialized = true;
    }

    public paintShortestPath() {
        if (!Number.isFinite(this.goal.distance)) {
            return; // lpa* did not found a path
        }
        this.map.cells.forEach(cell => {
            if (Number.isFinite(cell.distance) && cell.isFree) {
                cell.type = CellType.Visited;
            }
        });

        let node = this.goal;
        let nodeDistance = (cell: Cell) => cell.distance /*+ this.distance(node,cell)*/;
        do {
            let predecessors =
                this.getNeighbors(node, (x: Cell) => !x.isBlocked)
                    .filter(node => Number.isFinite(node.distance));

            if (predecessors.length === 0) { // deadend
                console.log("path is blocked");
                break;
            }

            node = _.minBy(predecessors, nodeDistance);
            if (node.isVisited) {
                node.type = CellType.Current;
                node.color = undefined;
            }
            // console.log("paint node"+ node.toString());
        } while (node !== this.start);
    }

    private neighborsFilter = (x: Cell) => !x.isBlocked && !x.isVisited;

    private calcKey(cell: Cell) {
        let k2 = Math.min(cell.distance, cell.rhs);
        let k1 = k2 + this.distance(cell, this.goal);

        return [Math.round(k1), Math.round(k2)];
    }

    private updateVertex(cell: Cell) {
        if (cell !== this.start) {

            let predecessorsRhsValues =
                this.getNeighbors(cell, this.neighborsFilter)
                    .map(x => x.distance + this.distance(x, cell));

            cell.rhs = Math.min(...predecessorsRhsValues);
        }

        if (this.openCells.has(cell)) {
            this.openCells.remove(cell);
        }
        if (cell.distance !== cell.rhs) {
            this.openCells.insert(cell, this.calcKey(cell));
        }

        // just to visualize the progress
        /*    if(!(cell.isGoal || cell.isStart))
              cell.type = CellType.Visited;*/
    }

    // find a shortest path from the start to the goal
    private computeShortestPath() {
        while (LpaStar.compareKeys(this.calcKey(this.goal), this.openCells.topKey()) === 1 ||
            this.goal.distance !== this.goal.rhs) {
            let item = this.openCells.pop();
            if (item.distance > item.rhs) {
                item.distance = item.rhs;
                this.getNeighbors(item, this.neighborsFilter).forEach(x => this.updateVertex(x));

            } else {
                item.distance = Number.POSITIVE_INFINITY;
                let itemAndNeighbors = this.getNeighbors(item, this.neighborsFilter);
                itemAndNeighbors.push(item);
                itemAndNeighbors.forEach(x => this.updateVertex(x));
            }
        }
    }

    // this relates to line 20 to 23 within [aij04]
    private mapUpdate(cells: Array<Cell>) {
        // {21} all directed edges (u, v) with changed edge costs [aij04]
        let updateList = new Array();
        cells.forEach(cell => {
            if (cell.isFree) {
                // If the cell has a old distance value we need to remove it.
                // This value is not valid anymore and will break the algorithm.
                cell.distance = Number.POSITIVE_INFINITY;
                updateList.push(cell);
            } else {
                updateList.push(...this.getNeighbors(cell, this.neighborsFilter));
            }
        });

        updateList.forEach(cell => this.updateVertex(cell));

        this.computeShortestPath();
        this.paintShortestPath();
    }
}
