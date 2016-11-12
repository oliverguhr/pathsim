System.register(["lodash", "./grid/index"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _, index_1;
    var Robot;
    return {
        setters:[
            function (_1) {
                _ = _1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            }],
        execute: function() {
            class Robot {
                constructor(map) {
                    this.map = map;
                    this.robot = new index_1.Moveable(map, index_1.CellType.Current);
                    this.robot.moveTo(map.getStartCell().position);
                }
                step() {
                    let path = this.map.cells.filter(cell => cell.isCurrent && cell.distance > this.currentDistance);
                    let nextCell = _.minBy(path, cell => cell.distance);
                    if (nextCell === undefined) {
                        return;
                    }
                    this.robot.moveTo(nextCell.position);
                    this.currentDistance = nextCell.distance;
                }
            }
            exports_1("Robot", Robot);
        }
    }
});
//# sourceMappingURL=Robot.js.map