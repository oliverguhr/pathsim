"use strict";
const _ = require("lodash");
const Cell_1 = require("./Cell");
const CellType_1 = require("./CellType");
class Map {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = [
            []
        ];
        this.changeListner = new Array();
        this.initializeGrid();
    }
    initializeGrid() {
        for (var row = 0; row < this.rows; row++) {
            this.grid.push([]);
            for (var col = 0; col < this.cols; col++) {
                this.grid[row].push(new Cell_1.Cell(row, col));
            }
        }
    }
    updateCellOnPosition(position, lambda) {
        var updatedCell = lambda(this.getCell(position.x, position.y));
        this.updateCell(updatedCell);
    }
    updateCell(cell) {
        this.grid[cell.position.y][cell.position.x] = cell;
        this.hasChanged(cell);
    }
    hasChanged(updatedCell) {
        this.changeListner.forEach(changeListner => changeListner(updatedCell));
    }
    notifyOnChange(lambda) {
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
        }
        else {
            return undefined;
        }
    }
    resetPath() {
        this.cells.filter(cell => cell.isVisited || cell.isCurrent).forEach(cell => {
            cell.type = CellType_1.CellType.Free;
            cell.color = undefined;
        });
    }
    resetBlocks() {
        this.cells.filter(cell => cell.isBlocked).forEach(cell => {
            cell.type = CellType_1.CellType.Free;
            cell.color = undefined;
        });
    }
}
exports.Map = Map;
//# sourceMappingURL=Map.js.map