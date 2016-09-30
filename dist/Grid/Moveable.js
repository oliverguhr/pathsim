System.register(["./CellType"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CellType_1;
    var Moveable;
    return {
        setters:[
            function (CellType_1_1) {
                CellType_1 = CellType_1_1;
            }],
        execute: function() {
            class Moveable {
                constructor(map, cellType) {
                    this.map = map;
                    this.cellType = cellType;
                }
                moveTo(position) {
                    if (this.position !== undefined) {
                        this.map.updateCellOnPosition(this.position, (cell) => {
                            cell.type = CellType_1.default.Free;
                            return cell;
                        });
                    }
                    this.position = position;
                    this.map.updateCellOnPosition(position, (cell) => {
                        cell.type = this.cellType;
                        this.currentCell = cell;
                        return cell;
                    });
                }
            }
            exports_1("Moveable", Moveable);
        }
    }
});
//# sourceMappingURL=Moveable.js.map