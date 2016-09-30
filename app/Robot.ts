import * as _ from "lodash";
import { Map, Moveable, CellType } from "./Grid/index";

export class Robot {
    currentDistance:number;
    robot: Moveable;

    constructor(private map:Map) {
        this.robot = new Moveable(map, CellType.Current);
        this.robot.moveTo(map.getStartCell().position);

    }

    step() {
        let nextCell = _.minBy(this.map.cells.filter(cell => cell.isCurrent && cell.distance > this.currentDistance), cell => cell.distance);

        if (nextCell === undefined) {
            return;
        }
        this.robot.moveTo(nextCell.position);
        this.currentDistance = nextCell.distance;
    }
}
