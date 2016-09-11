import * as _ from "lodash";
import {Cell} from "./Cell";
import {CellType} from "./CellType";
import {Position} from "./Position";


export class Map {
    grid:Array<Array<Cell>>
    changeListner:Function[]
    constructor(public rows :number, public cols: number) {
        this.grid = [
            []
        ];
        this.initializeGrid();
    }

    initializeGrid() {
        for (var row = 0; row < this.rows; row++) {
            this.grid.push([]);
            for (var col = 0; col < this.cols; col++) {
                this.grid[row].push(new Cell(row, col));
            }
        }
    }

    //todo: use array observe: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/observe
    //using this function will automatically singnalize that the map has changed
    updateCellOnPosition(position:Position, lambda:Function) {
        var updatedCell = lambda(this.getCell(position.x, position.y));
        this.updateCell(updatedCell);
    }

    updateCell(cell:Cell) {
        this.grid[cell.position.y][cell.position.x] = cell;
        this.hasChanged(cell);
    }

    hasChanged(updatedCell:Cell) {
        this.changeListner.forEach(changeListner => changeListner(updatedCell));
    }

    notifyOnChange(lambda:Function) {
        this.changeListner.push(lambda);
    }

    getStartCell() {
        return this.cells.find(cell => cell.isStart);
    }

    getGoalCell() {
        return this.cells.find(cell => cell.isGoal);
    }

    get cells() {
        return _.flatten(this.grid);
    }

    getCell(x, y) {
        if (x >= 0 && y >= 0 && x < this.cols && y < this.rows) {
            return this.grid[y][x];
        } else {
            return undefined;
        }
    }
    resetPath() {
        this.cells.filter(cell => cell.isVisited || cell.isCurrent).forEach(cell => {
            cell.type = CellType.Free;
            cell.color = undefined;
        });
    }

    resetBlocks() {
        this.cells.filter(cell => cell.isBlocked).forEach(cell => {
            cell.type = CellType.Free;
            cell.color = undefined;
        });
    }
}
