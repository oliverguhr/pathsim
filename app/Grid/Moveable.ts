import CellType from "./CellType";
import {Map} from "./Map";
import {Cell} from "./Cell";
import {Position} from "./Position";

export class Moveable {
    position: Position;
    currentCell: Cell;
    constructor(public map: Map, public cellType: CellType) {
    }

    moveTo(position:Position) {
        if (this.position !== undefined) {
            this.map.updateCellOnPosition(this.position, (cell:Cell) => {
                cell.type = CellType.Free;
                return cell;
            });
        }
        this.position = position;
        this.map.updateCellOnPosition(position, (cell:Cell) => {
            cell.type = this.cellType;
            this.currentCell = cell;
            return cell;
        });
    }
}
