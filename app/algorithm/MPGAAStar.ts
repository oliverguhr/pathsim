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
    /** Iteration counter. Incremented before every A* search. */
    private counter: number;
    private currentCell: Cell;
    private searches: TypMappedDictionary<Cell, number>;

    constructor(map: Map, private visibiltyRange: number) {
        super();

        let queueConfig = {
            comparator: (a: Cell, b: Cell) => a.estimatedDistance - b.estimatedDistance,
        };
        this.map = map;
        this.openCells = new PriorityQueue.ArrayStrategy<Cell>(queueConfig);
        this.goal = this.map.getGoalCell();
        this.start = this.map.getStartCell();
        this.currentCell = this.start;
        /*
         * searches (number) returns the number of the last search in which s (the cell) was generated. 
         * If it is equal to 0 if s has never been generated.
         */
        this.searches = new TypMappedDictionary<Cell, number>(cell => this.map.getIndexOfCell(cell), 0);
    }

    /**
     * Entry point. 
     * Equals to "main()" Line 56 within the pseudo code
     */
    public run() {
        this.counter = 0;
        this.observe(this.start);

        /*
        for each state s ∈ S do        
            search(s) ← 0
            h(s) ← H(s, s goal )        
            next(s) ← null
        */
        this.map.cells.forEach(cell => {
            this.searches.set(cell, 0);
            cell.estimatedDistance = this.distance(cell, this.goal);

        });
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
                    // todo / verify: What if changedCell is blocked now?
                    changedCell.distance = Number.POSITIVE_INFINITY;
                } else {
                    changedCell.distance = changedCell.previous.distance +
                        this.distance(changedCell, changedCell.previous);
                }

                if (changedCell.distance > oldDistance) {
                    // hint: this is not strictly necessary in a GAA* implementation
                    // todo next(t) ← null                    
                }
                if (changedCell.distance < oldDistance) {
                    this.reestablishConsitency();
                }
            }
        });

    }
    private reestablishConsitency() {
        // todo: write code
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
