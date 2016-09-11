import {CellType} from "./CellType";
import {Position} from "./Position";

export class Cell {
    position : Position;
    cellType: CellType;
    rhs : number;
    distance:number;
    color: string;

    constructor(row:number, col:number, cellType = CellType.Free) {
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
