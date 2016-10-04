"use strict";
const CellType_1 = require("./CellType");
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
exports.Moveable = Moveable;
//# sourceMappingURL=Moveable.js.map