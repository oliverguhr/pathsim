"use strict";
const _ = require("lodash");
const index_1 = require("./Grid/index");
class ObstacleGenerator {
    constructor(map) {
        this.map = map;
    }
    addRandomObstacles(count) {
        var freeCells = this.map.cells.reduce((prev, curr) => {
            if (curr.isBlockable)
                prev++;
            return prev;
        }, 0);
        if (count > freeCells)
            count = freeCells;
        for (var i = 0; i < count; i++) {
            let row = _.random(0, this.map.rows - 1);
            let col = _.random(0, this.map.cols - 1);
            if (this.map.grid[row][col].isBlockable) {
                this.map.grid[row][col].type = index_1.CellType.Blocked;
            }
            else {
                i--;
            }
        }
    }
}
exports.ObstacleGenerator = ObstacleGenerator;
//# sourceMappingURL=ObstacleGenerator.js.map