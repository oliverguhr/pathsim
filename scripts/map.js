/*jshint esversion: 6 */
//var _ = require('lodash');

class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return "x = " + this.x + " y = " + this.y;
    }
}

class Moveable {
    constructor(map, cellType) {

        this.cellType = cellType;
        this.map = map;
        this.position = undefined;
        this.currentCell = undefined;
    }

    moveTo(position) {
        if (this.position !== undefined) {
            this.map.updateCellOnPosition(this.position, cell => {
                cell.type = CellType.Free;
                return cell;
            });
        }
        this.position = position;
        this.map.updateCellOnPosition(position, cell => {
            cell.type = this.cellType;
            this.currentCell = cell;
            return cell;
        });
    }
}


class Map {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.changeListner = [];
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

class Cell {
    constructor(row, col, cellType = CellType.Free) {
        this.position = new Position(col, row);
        this.cellType = cellType;
    }

    set type(cellType) {
        this.cellType = cellType;
    }
    get type() {
        return this.cellType;
    }

    get isFree() {
        return this.type === CellType.Free;
    }
    get isBlocked() {
        return this.type === CellType.Blocked;
    }
    get isVisited() {
        return this.type === CellType.Visited;
    }
    get isCurrent() {
        return this.type === CellType.Current;
    }
    get isStart() {
        return this.type === CellType.Start;
    }
    get isGoal() {
        return this.type === CellType.Goal;
    }
    get isBlockable(){
        return this.isFree || this.isCurrent || this.isVisited;
    }

    toString(){
      let result = `[${this.position.x},${this.position.y}]`;

      if(this.rhs !== undefined)
        result += " rhs= " + this.rhs;

      if(this.distance !== undefined)
        result += " distance= " + this.distance;

      return result;
    }
}

var CellType = Object.freeze({
    Free: 0,
    Blocked: 1,
    Visited: 2,
    Current: 3,
    Start: 4,
    Goal: 5
});
