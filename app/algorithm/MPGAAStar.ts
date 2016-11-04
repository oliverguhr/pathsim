/*
 * MPGAA* = Multipath Generalized Adaptive A*
 * Paper "Reusing Previously Found A* Paths for Fast Goal-Directed Navigation in Dynamic Terrain" HernandezAB15
*/

import { Cell, Map, CellType, Position } from "../grid/index";
import { PathAlgorithm } from "./PathAlgorithm";
import * as PriorityQueue from "js-priority-queue";
import { Distance } from "./Distance";
import { TypMappedDictionary } from "./../tools/index";
import { SimplePriorityQueue } from './../tools/SimplePriorityQueue';

export class MPGAAStar extends PathAlgorithm {
    private goal: Cell;
    private start: Cell;
    private openCells: SimplePriorityQueue<Cell, number>;
    private closedCells: SimplePriorityQueue<Cell, number>;
    /** Iteration counter. Incremented before every A* search. */
    private counter: number;

    /** Current postion of the robot */
    private currentCell: Cell;

    /**
     * searches (number) returns the number of the last search in which s (the cell) was generated.
     * If it is equal to 0 if s has never been generated.
     */
    private searches: TypMappedDictionary<Cell, number>;

    /**
     * Contains the pointer for each state s along the path found by A*
     */
    private next: TypMappedDictionary<Cell, Cell>;
    private parent: TypMappedDictionary<Cell, Cell>;

    constructor(public map: Map, private visibiltyRange: number) {
        super();

        this.closedCells = new SimplePriorityQueue<Cell, number>((a, b) => a - b, 0);
        this.openCells = new SimplePriorityQueue<Cell, number>((a, b) => a - b, 0);
        this.goal = this.map.getGoalCell();
        this.start = this.map.getStartCell();
        this.currentCell = this.start;
        this.searches = new TypMappedDictionary<Cell, number>(cell => this.map.getIndexOfCell(cell), 0);
        this.next = new TypMappedDictionary<Cell, Cell>(cell => this.map.getIndexOfCell(cell));
        this.parent = new TypMappedDictionary<Cell, Cell>(cell => this.map.getIndexOfCell(cell));
    }

    /**
     * Entry point.
     * Equals to "main()" Line 56 within the pseudo code
     */
    public run() {
        this.counter = 0;
        this.observe(this.start);

        this.map.cells.forEach(cell => {
            this.searches.set(cell, 0);
            cell.estimatedDistance = this.distance(cell, this.goal);
            this.next.delete(cell); // todo: check if we really need this line
        });

        while (this.start !== this.goal) {
            this.counter++;
            let s = this.aStar(this.start);

            if (s === null) {
                // todo: check if its handy to throw an error here.
                throw new Error("goal is not reachable");
            }

            /* todo: Pseudo code says:
                for each s' ∈ Closed do
                    h(s' ) ← g(s) + h(s) − g(s' ) // heuristic update
                Check if s' ∈ Closed means neighbors of s that are on the closed list
            */
            let cells = this.getNeighbors(s, (x: Cell) => this.closedCells.has(x));

            cells.forEach(cell => {
                // heuristic update
                cell.estimatedDistance = s.distance + s.estimatedDistance - cell.distance;
            });

            this.buildPath(s);

            break; // until we do not have a moving robot we have to stop here

            // hint: the code for lines 71 to 77 have been / will be moved in a seperate component
            // move a long the calulated path.
            // todo: check how this interacts with the map.
            // this should be part of the robot that is moving along the path
            /*
              do {
                  let t = this.start;
                  this.start = this.next.get(this.start);
                  this.next.delete(t);
              } while (this.start !== this.goal  // or a change in c has been observed
              );
            */
        }
    }

    private buildPath(s: Cell): void {
        while (s !== this.start) {
            if (!(s.isGoal || s.isStart)) {
                s.type = CellType.Current;
                s.color = undefined;
            }
            let parent = this.parent.get(s);
            this.next.set(parent, s);
            s = parent;
        }
    }

    private aStar(init: Cell): Cell {
        // todo: add code
        // cell.distance = g(x)
        // cell.estimatedDistance = f(x)
        // h(x) = this.distance(x,this.goal)
        // f Pfad vom Start zum Ziel f(x)=g(x)+h(x)
        // g(x) die bisherigen Kosten vom Startknoten
        // h(x) die geschätzten Kosten von x bis zum Zielknoten

        this.initializeState(init);
        this.parent.set(init, undefined);

        init.distance = 0;

        this.openCells.clear();

        this.updateF(init);

        this.openCells.insert(init, init.estimatedDistance);

        this.closedCells.clear();

        while (!this.openCells.isEmpty) {
            let s = this.openCells.pop();
            if (s.isGoal) {
                return s;
            }

            this.closedCells.insert(s, s.estimatedDistance);

            let neighbors = this.getNeighbors(s, cell => !cell.isBlocked);

            for (let neighbor of neighbors) {
                this.initializeState(neighbor);
                let neighborsDistance = s.distance + this.distance(neighbor, s);
                if (neighbor.distance > neighborsDistance) {
                    neighbor.distance = neighborsDistance;
                    this.parent.set(neighbor, s);
                    this.updateF(neighbor);
                    if (this.openCells.has(neighbor)) {
                        this.openCells.updateKey(neighbor, neighbor.estimatedDistance);
                    }
                    else {
                        this.openCells.insert(neighbor, neighbor.estimatedDistance);
                    }
                }
                if (!(neighbor.isGoal || neighbor.isStart)) {
                    neighbor.cellType = CellType.Visited;
                }
            }
        }
        return null;
    }

    /** returns the heuristic distance value from the cell to the goal. */
    private h(cell: Cell) {
        return this.distance(cell, this.goal);
    }

    /** Updates the estimated distance value for a given cell*/
    private updateF(cell: Cell) {
        cell.estimatedDistance = cell.distance + this.h(cell);
    }

    private initializeState(s: Cell) {
        if (this.searches.get(s) !== this.counter) {
            s.distance = Number.POSITIVE_INFINITY;
        }
        else if (s.isGoal) {

            //   console.error(s,this.searches.get(s), this.counter);
        }
        this.searches.set(s, this.counter);
    }

    private insertState(s: Cell, sSuccessor: Cell, queue: SimplePriorityQueue<Cell, number>) {
        let newEstimatedDistance = this.distance(s, sSuccessor) + sSuccessor.estimatedDistance;
        if (s.estimatedDistance > newEstimatedDistance) {
            s.estimatedDistance = newEstimatedDistance;
            if (queue.has(s)) {
                queue.updateKey(s, s.estimatedDistance);
            } else {
                queue.insert(s, s.estimatedDistance);
            }
        }
    }

    private reestablishConsitency(cell: Cell) {
        /*
            For the sake of simplicty we call this method everytime we found a
            new cell with decreased edege (read arc) costs. 
            To improve the performace one should mark all these cells and process 
            them in one run.
        */

        let queue = new SimplePriorityQueue<Cell, number>((a, b) => b - a, 0);

        // for each (s, s') such that c(s, s') decreased do
        let neighbors = this.getNeighbors(cell,
            (x: Cell) => (cell.distance + this.distance(x, cell)) < x.distance);
        // InsertState (s, s' , Q)
        neighbors.forEach(x => this.insertState(cell, x, queue));

        while (!queue.isEmpty) {
            // Extract state s' with lowest h-value in Q
            let lowCell = queue.pop();
            let lowNeighbors = this.getNeighbors(lowCell, (x: Cell) => !x.isBlocked);
            lowNeighbors.forEach(x => this.insertState(lowCell, x, queue));
        }
    }

    /**
     * Observes map changes
     * Line 33 in pseudo code
     */
    private observe(start: Cell) {
        this.map.notifyOnChange(changedCell => {
            /*  Todo: Review
                Pseudo Code Line 34 to 38

                We remove all cells with increased edge costs from the current path.
                In our case, we remove blocked cells from the path.
            */
            let distance = Distance.euklid(changedCell, this.currentCell);
            if (distance < this.visibiltyRange) { // arcs in the range of visibility from s
                if (changedCell.isBlocked) {
                    this.next.delete(changedCell);
                } else {
                    /*
                        Todo: Fix this. 
                        ReestablishConsitency should only be called, if the cell was blocked befor. 
                        Sice the map does not provide the old value yet, we can't tell if the state has changed.
                        However, until this is fixed we invoke it everytime. This should not hurt, but reduce the performance. 
                    */
                    this.reestablishConsitency(changedCell);
                }
            }
        });
    }
}
