System.register(["lodash", "../grid/index"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _, index_1;
    var ObstacleGenerator;
    return {
        setters:[
            function (_1) {
                _ = _1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            }],
        execute: function() {
            ObstacleGenerator = class ObstacleGenerator {
                constructor(map) {
                    this.map = map;
                }
                addRandomObstacles(count) {
                    let freeCells = this.map.cells.reduce((prev, curr) => {
                        if (curr.isBlockable) {
                            prev++;
                        }
                        return prev;
                    }, 0);
                    if (count > freeCells) {
                        count = freeCells;
                    }
                    for (let i = 0; i < count; i++) {
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
            };
            exports_1("ObstacleGenerator", ObstacleGenerator);
        }
    }
});
//# sourceMappingURL=ObstacleGenerator.js.map