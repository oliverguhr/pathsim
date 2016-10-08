/*
 * MPGAA* = Multipath Generalized Adaptive A*
 * Paper "Reusing Previously Found A* Paths for Fast Goal-Directed Navigation in Dynamic Terrain" HernandezAB15
*/

import {Cell, Map, CellType, Position} from "../grid/index";
import { PathAlgorithm } from "./PathAlgorithm";
import * as PriorityQueue from "js-priority-queue";
import { Distance } from "./Distance";
import { TypMappedDictionary } from "./../tools/index";

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
          //  this.next.dictionary;
        }
    }

    private aStar(init: Cell): Cell {
        // todo: add code
        return null;
    }

    private reestablishConsitency() {
        // todo: write code
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
                // update c(t, t' )                    
                let oldDistance = changedCell.distance;

                if (changedCell.isBlocked) {
                    // todo verify: What if changedCell is blocked now? 
                    // check if this code really does what we might think it does
                    changedCell.distance = Number.POSITIVE_INFINITY;
                } else {
                    changedCell.distance = changedCell.previous.distance +
                        this.distance(changedCell, changedCell.previous);
                }

                if (changedCell.distance > oldDistance) {
                    // hint: this is not strictly necessary in a GAA* implementation                      
                    this.next.delete(changedCell);
                }
                if (changedCell.distance < oldDistance) {
                    this.reestablishConsitency();
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
