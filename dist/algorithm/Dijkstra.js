System.register(["./PathAlgorithm", '../grid/index', "lodash"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var PathAlgorithm_1, index_1, _;
    var Dijkstra;
    return {
        setters:[
            function (PathAlgorithm_1_1) {
                PathAlgorithm_1 = PathAlgorithm_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (_1) {
                _ = _1;
            }],
        execute: function() {
            class Dijkstra extends PathAlgorithm_1.PathAlgorithm {
                constructor(map) {
                    super();
                    this.map = map;
                    this.cells = [];
                    this.initialize();
                }
                initialize() {
                    let cells = this.map.cells.filter(cell => !cell.isBlocked);
                    for (let cell of cells) {
                        cell.previous = undefined;
                        cell.distance = Number.POSITIVE_INFINITY;
                        this.cells.push(cell);
                    }
                    this.map.getStartCell().distance = 0;
                }
                run() {
                    while (this.step()) { }
                }
                step() {
                    let isRunning = true;
                    let currentCell = _.minBy(this.cells, c => c.distance);
                    if (currentCell.isGoal) {
                        this.paintShortestPath();
                        return false;
                    }
                    _.pull(this.cells, currentCell);
                    let neighbors = this.getNeighbors(currentCell, (cell) => !cell.isBlocked && !cell.isVisited);
                    for (let neighbor of neighbors) {
                        if (isRunning)
                            this.updateDistance(currentCell, neighbor);
                        if (neighbor.isGoal) {
                            this.paintShortestPath();
                            isRunning = false;
                            break;
                        }
                    }
                    return isRunning;
                }
                updateDistance(previousCell, currentCell) {
                    let distance = previousCell.distance + this.distance(previousCell, currentCell);
                    if (distance < currentCell.distance) {
                        currentCell.distance = distance;
                        currentCell.previous = previousCell;
                    }
                    if (currentCell.isFree) {
                        currentCell.type = index_1.CellType.Visited;
                    }
                }
            }
            exports_1("Dijkstra", Dijkstra);
        }
    }
});
//# sourceMappingURL=Dijkstra.js.map