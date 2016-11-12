System.register(["./Distance", "../grid/index", "lodash"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Distance_1, index_1, _;
    var PathAlgorithm;
    return {
        setters:[
            function (Distance_1_1) {
                Distance_1 = Distance_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (_1) {
                _ = _1;
            }],
        execute: function() {
            PathAlgorithm = class PathAlgorithm {
                constructor() {
                    this.distance = Distance_1.Distance.euclid;
                }
                paintShortestPath() {
                    let start = this.map.getStartCell();
                    let node = this.map.getGoalCell();
                    let nodeDistance = (cell) => cell.distance;
                    do {
                        let predecessors = this.getNeighbors(node, (cell) => !cell.isBlocked)
                            .filter(node => Number.isFinite(node.distance));
                        if (predecessors.length === 0) {
                            console.log("path is blocked");
                            break;
                        }
                        node = _.minBy(predecessors, nodeDistance);
                        if (node.isVisited) {
                            node.type = index_1.CellType.Current;
                            node.color = undefined;
                        }
                    } while (node !== start);
                }
                getNeighbors(cell, condition) {
                    let neighbors = new Array();
                    this.addCellIfpassable(cell.position.x + 0, cell.position.y - 1, neighbors, condition);
                    this.addCellIfpassable(cell.position.x + 0, cell.position.y + 1, neighbors, condition);
                    this.addCellIfpassable(cell.position.x + 1, cell.position.y + 0, neighbors, condition);
                    this.addCellIfpassable(cell.position.x - 1, cell.position.y + 0, neighbors, condition);
                    this.addCellIfpassable(cell.position.x + 1, cell.position.y + 1, neighbors, condition);
                    this.addCellIfpassable(cell.position.x - 1, cell.position.y + 1, neighbors, condition);
                    this.addCellIfpassable(cell.position.x + 1, cell.position.y - 1, neighbors, condition);
                    this.addCellIfpassable(cell.position.x - 1, cell.position.y - 1, neighbors, condition);
                    return neighbors;
                }
                addCellIfpassable(x, y, neighbors, condition) {
                    let cell = this.map.getCell(x, y);
                    if (cell !== undefined && condition(cell)) {
                        neighbors.push(cell);
                    }
                }
            };
            exports_1("PathAlgorithm", PathAlgorithm);
        }
    }
});
//# sourceMappingURL=PathAlgorithm.js.map