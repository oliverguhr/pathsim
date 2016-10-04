import * as _ from "lodash";
import { Map, Moveable, CellType } from "./grid/index";

export class Robot {
    private currentDistance: number;
    private robot: Moveable;

    constructor(private map: Map) {
        this.robot = new Moveable(map, CellType.Current);
        this.robot.moveTo(map.getStartCell().position);

    }

    public step() {
        let path = this.map.cells.filter(cell => cell.isCurrent && cell.distance > this.currentDistance);
        let nextCell = _.minBy(path, cell => cell.distance);

        if (nextCell === undefined) {
            return;
        }
        this.robot.moveTo(nextCell.position);
        this.currentDistance = nextCell.distance;
    }
}
