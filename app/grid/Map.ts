import * as _ from "lodash";
import {Cell} from "./Cell";
import {CellType} from "./CellType";
import {Position} from "./Position";

export class Map {
    public grid: Array<Array<Cell>>;
    private changeListner: Function[];
    constructor(public rows: number, public cols: number) {
        this.grid = [
            [],
        ];
        this.changeListner = new Array<(cell: Cell) => void>();
        this.initializeGrid();
    }

    // todo: use array observe: 
    // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/observe
    // using this function will automatically singnalize that the map has changed
    public updateCellOnPosition(position: Position, lambda: Function) {
        let updatedCell = lambda(this.getCell(position.x, position.y));
        this.updateCell(updatedCell);
    }

    public updateCell(cell: Cell) {
        this.grid[cell.position.y][cell.position.x] = cell;
        this.hasChanged(cell);
    }

    /** add a function that gets notifyed when a cell on the map changes */
    public notifyOnChange(lambda: (cell: Cell) => void) {
        this.changeListner.push(lambda);
    }

    /** get the start cell */
    public getStartCell() {
        return this.cells.find(cell => cell.isStart);
    }

    /** get the goal cell */
    public getGoalCell() {
        return this.cells.find(cell => cell.isGoal);
    }

    /** get all cells as flat map */
    get cells() {
        return _.flatten(this.grid);
    }

    public getCell(x: number, y: number) {
        if (x >= 0 && y >= 0 && x < this.cols && y < this.rows) {
            return this.grid[y][x];
        } else {
            return undefined;
        }
    }

    /** 
     * gets the zero based index of a cell 
     * can be used with "cells" getter 
     */
    public getIndexOfCell(cell: Cell) {
        return (cell.position.x + (cell.position.y - 1) * this.rows) - 1;
    }

    public resetPath() {
        this.cells.filter(cell => cell.isVisited || cell.isCurrent).forEach(cell => {
            cell.type = CellType.Free;
            cell.color = undefined;
        });
    }

    public resetBlocks() {
        this.cells.filter(cell => cell.isBlocked).forEach(cell => {
            cell.type = CellType.Free;
            cell.color = undefined;
        });
    }

    private hasChanged(updatedCell: Cell) {
        this.changeListner.forEach(changeListner => changeListner(updatedCell));
    }

    private initializeGrid() {
        for (let row = 0; row < this.rows; row++) {
            this.grid.push([]);
            for (let col = 0; col < this.cols; col++) {
                this.grid[row].push(new Cell(row, col));
            }
        }
    }
}
