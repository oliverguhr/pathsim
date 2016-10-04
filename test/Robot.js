"use strict";
const _ = require("lodash");
const index_1 = require("./Grid/index");
class Robot {
    constructor(map) {
        this.map = map;
        this.robot = new index_1.Moveable(map, index_1.CellType.Current);
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
exports.Robot = Robot;
//# sourceMappingURL=Robot.js.map