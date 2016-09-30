System.register(["./CellType", "./Position"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CellType_1, Position_1;
    var Cell;
    return {
        setters:[
            function (CellType_1_1) {
                CellType_1 = CellType_1_1;
            },
            function (Position_1_1) {
                Position_1 = Position_1_1;
            }],
        execute: function() {
            class Cell {
                constructor(row, col, cellType = CellType_1.CellType.Free) {
                    this.position = new Position_1.Position(col, row);
                    this.cellType = cellType;
                }
                set type(cellType) {
                    this.cellType = cellType;
                }
                get type() {
                    return this.cellType;
                }
                get isFree() {
                    return this.type === CellType_1.CellType.Free;
                }
                get isBlocked() {
                    return this.type === CellType_1.CellType.Blocked;
                }
                get isVisited() {
                    return this.type === CellType_1.CellType.Visited;
                }
                get isCurrent() {
                    return this.type === CellType_1.CellType.Current;
                }
                get isStart() {
                    return this.type === CellType_1.CellType.Start;
                }
                get isGoal() {
                    return this.type === CellType_1.CellType.Goal;
                }
                get isBlockable() {
                    return this.isFree || this.isCurrent || this.isVisited;
                }
                toString() {
                    let result = `[${this.position.x},${this.position.y}]`;
                    if (this.rhs !== undefined)
                        result += " rhs= " + this.rhs;
                    if (this.distance !== undefined)
                        result += " distance= " + this.distance;
                    return result;
                }
            }
            exports_1("Cell", Cell);
        }
    }
});
//# sourceMappingURL=Cell.js.map