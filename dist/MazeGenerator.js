System.register(["lodash", "./Grid/index"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _, index_1;
    var MazeGenerator;
    return {
        setters:[
            function (_1) {
                _ = _1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            }],
        execute: function() {
            class MazeGenerator {
                constructor(map) {
                    this.map = map;
                }
                createMaze(walls = 5, minDistanceBetweenWalls = 5) {
                    for (var i = 0; i < walls; i++) {
                        this.generateRandomWall(minDistanceBetweenWalls);
                    }
                }
                generateRandomWall(minDistanceBetweenWalls) {
                    let vertical = _.random(0, 1);
                    let stepsY = this.map.rows / minDistanceBetweenWalls;
                    let stepsX = this.map.cols / minDistanceBetweenWalls;
                    let y = Math.round((this.map.rows / stepsY) * _.random(1, stepsY - 1));
                    let x = Math.round((this.map.cols / stepsX) * _.random(1, stepsX - 1));
                    console.log("map x=60 y=35 rand x" + x + " y=" + y + "steps  x=" + stepsX + " y=" + stepsY);
                    let postionStart, postionEnd;
                    if (vertical === 1) {
                        postionStart = new index_1.Position(0, y);
                        postionEnd = new index_1.Position(this.map.cols, y);
                    }
                    else {
                        postionStart = new index_1.Position(x, 0);
                        postionEnd = new index_1.Position(x, this.map.rows);
                    }
                    this.drawWall(postionStart, postionEnd);
                }
                drawWall(positionStart, positionEnd) {
                    let diffX = positionEnd.x - positionStart.x;
                    let diffY = positionEnd.y - positionStart.y;
                    let lastDoor = 0;
                    let cell;
                    for (var i = 0; i < diffX; i++) {
                        cell = this.map.grid[positionStart.y][positionStart.x + i];
                        if (cell.isBlockable) {
                            cell.type = index_1.CellType.Blocked;
                        }
                        else if (cell.isBlocked) {
                            this.map.grid[positionStart.y][positionStart.x + _.random(lastDoor, i - 1)].type = index_1.CellType.Free;
                            lastDoor = i;
                            if (_.random(0, 1) === 1) {
                                break;
                            }
                        }
                    }
                    lastDoor = 0;
                    for (i = 0; i < diffY; i++) {
                        cell = this.map.grid[positionStart.y + i][positionEnd.x];
                        if (cell.isBlockable) {
                            cell.type = index_1.CellType.Blocked;
                        }
                        else if (cell.isBlocked) {
                            this.map.grid[positionStart.y + _.random(lastDoor, i - 1)][positionEnd.x].type = index_1.CellType.Free;
                            lastDoor = i;
                            if (_.random(0, 1) === 1) {
                                break;
                            }
                        }
                    }
                }
            }
            exports_1("MazeGenerator", MazeGenerator);
        }
    }
});
//# sourceMappingURL=MazeGenerator.js.map