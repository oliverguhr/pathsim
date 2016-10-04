"use strict";
const _ = require("lodash");
const index_1 = require("./Grid/index");
class DynmicObstacleGenerator {
    constructor(map) {
        this.map = map;
    }
    add() {
        let robot = new index_1.Moveable(this.map, index_1.CellType.Blocked);
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
            robot.moveTo(new index_1.Position(x, y));
            robot.currentCell.color = '#BBF';
        }
    }
    isPositionFree(x, y) {
        var cell = this.map.getCell(x, y);
        if (cell !== undefined) {
            return cell.isFree || cell.isVisited || cell.isCurrent;
        }
        return false;
    }
    getRandomPosition() {
        let y;
        let x;
        do {
            y = _.random(0, this.map.rows - 1);
            x = _.random(0, this.map.cols - 1);
        } while (!this.isPositionFree(x, y));
        return new index_1.Position(x, y);
    }
}
exports.DynmicObstacleGenerator = DynmicObstacleGenerator;
//# sourceMappingURL=DynmicObstacleGenerator.js.map