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
    private openCells: PriorityQueue<Cell>;
    private closedCells: Array<Cell>;
    /** Iteration counter. Incremented before every A* search. */
    private counter: number;
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

    constructor(map: Map, private visibiltyRange: number) {
        super();

        let queueConfig = {
            comparator: (a: Cell, b: Cell) => a.estimatedDistance - b.estimatedDistance,
        };
        this.map = map;
        this.closedCells = new Array<Cell>();
        this.openCells = new PriorityQueue.ArrayStrategy<Cell>(queueConfig);
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
            let cells = this.getNeighbors(s, (x: Cell) => this.closedCells.indexOf(x) !== -1);
            cells.forEach(cell => {
                // heuristic update
                cell.estimatedDistance = s.distance + s.estimatedDistance - cell.distance;
            });

            this.buildPath(s);

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
            let parent = this.parent.get(s);
            this.next.set(parent, s);
            s = parent;
        }
    }

    private aStar(init: Cell): Cell {
        // todo: add code
        return null;
    }

    private insertState(s: Cell, sSuccessor: Cell, queue: SimplePriorityQueue<Cell, number>) {

    }

    private reestablishConsitency() {
        // todo: write code
        let queue = new SimplePriorityQueue<Cell, number>((a, b) => a - b, 0);

        // for each (s, s 0 ) such that c(s, s 0 ) decreased do
        //    InsertState (s, s 0 , Q)
        // remaks: we might get this cells from observe..

        let hack : Cell[];

      /*  for(let cell of hack){
            this.insertState();
        }
      */
    }

    /**
     * Observes map changes
     * Line 33 in pseudo code
     */
    private observe(start: Cell) {
        this.map.notifyOnChange(changedCell => {
            // arcs in the range of visibility from s
            let distance = Distance.euklid(changedCell, this.currentCell);
            if (distance < this.visibiltyRange) {

                let neighbors = this.getNeighbors(changedCell, c => !c.isBlocked);
                // for each (t, t 0 ) in T do
                for(let neighbor of neighbors)
                {
                  // update c(t, t' )
                  let oldDistance = neighbor.distance;

                  changedCell.distance = neighbor.previous.distance +
                  this.distance(changedCell, neighbor.previous);

                  if (neighbor.distance > oldDistance) {
                    // hint: this is not strictly necessary in a GAA* implementation
                    this.next.delete(neighbor);
                  }
                  if (neighbor.distance < oldDistance) {
                    this.reestablishConsitency();
                  }
                }
            }
        });
    }

    /*  private initialize() {
          let cells = this.map.cells.filter(cell => !cell.isBlocked);

          for (let i = 0; i < cells.length; i++) {
              cells[i].previous = undefined;
              cells[i].distance = Number.POSITIVE_INFINITY;
              cells[i].isOpen = true;
          }

          this.start.distance = 0;
          this.start.estimatedDistance = this.distance(this.start, this.goal);
          this.openCells.queue(this.start);
      }*/

}