System.register(["lodash", "./Cell", "./CellType"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _, Cell_1, CellType_1;
    var Map;
    return {
        setters:[
            function (_1) {
                _ = _1;
            },
            function (Cell_1_1) {
                Cell_1 = Cell_1_1;
            },
            function (CellType_1_1) {
                CellType_1 = CellType_1_1;
            }],
        execute: function() {
            class Map {
                constructor(rows, cols) {
                    this.rows = rows;
                    this.cols = cols;
                    this.grid = [
                        [],
                    ];
                    this.changeListner = new Array();
                    this.initializeGrid();
                }
                updateCellOnPosition(position, lambda) {
                    let updatedCell = lambda(this.getCell(position.x, position.y));
                    this.updateCell(updatedCell);
                }
                updateCell(cell) {
                    this.grid[cell.position.y][cell.position.x] = cell;
                    this.hasChanged(cell);
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
                getIndexOfCell(cell) {
                    return ((cell.position.y) * this.cols) + cell.position.x;
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
                hasChanged(updatedCell) {
                    this.changeListner.forEach(changeListner => changeListner(updatedCell));
                }
                initializeGrid() {
                    for (let row = 0; row < this.rows; row++) {
                        this.grid.push([]);
                        for (let col = 0; col < this.cols; col++) {
                            this.grid[row].push(new Cell_1.Cell(row, col));
                        }
                    }
                }
            }
            exports_1("Map", Map);
        }
    }
});
//# sourceMappingURL=Map.js.map