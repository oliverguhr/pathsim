import * as _ from "lodash";
import { Map, Moveable, CellType, Cell,Position } from "./Grid/index";


export class DynmicObstacleGenerator {
  robots:Moveable[]
    constructor(private map:Map) {}

    add() {
        let robot = new Moveable(this.map, CellType.Blocked);
        robot.moveTo(this.getRandomPosition());
        robot.currentCell.color = '#BBF';
        this.robots.push(robot);
    }

    update() {
        for (let robot of this.robots) {
            let y;
            let x;
            do {
                y = robot.position.y + _.random(-1, 1);
                x = robot.position.x + _.random(-1, 1);
            } while (!this.isPositionFree(x, y));
            robot.currentCell.color = undefined;
            robot.moveTo(new Position(x, y));
            robot.currentCell.color = '#BBF';
        }
    }

    private isPositionFree(x, y) {
        var cell = this.map.getCell(x, y);
        if (cell !== undefined) {
            return cell.isFree || cell.isVisited || cell.isCurrent;
        }
        return false;
    }

    private getRandomPosition() {
        let y;
        let x;
        do {
            y = _.random(0, this.map.rows - 1);
            x = _.random(0, this.map.cols - 1);
        } while (!this.isPositionFree(x, y));

        return new Position(x, y);
    }
}
