System.register(["../grid/index", "./PathAlgorithm", "../SimplePriorityQueue", "lodash"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var index_1, PathAlgorithm_1, SimplePriorityQueue_1, _;
    var LpaStar;
    return {
        setters:[
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (PathAlgorithm_1_1) {
                PathAlgorithm_1 = PathAlgorithm_1_1;
            },
            function (SimplePriorityQueue_1_1) {
                SimplePriorityQueue_1 = SimplePriorityQueue_1_1;
            },
            function (_1) {
                _ = _1;
            }],
        execute: function() {
            LpaStar = class LpaStar extends PathAlgorithm_1.PathAlgorithm {
                constructor(map) {
                    super();
                    this.neighborsFilter = (x) => !x.isBlocked && !x.isVisited;
                    this.isInitialized = false;
                    this.map = map;
                    this.openCells = new SimplePriorityQueue_1.SimplePriorityQueue();
                    this.goal = this.map.getGoalCell();
                    this.start = this.map.getStartCell();
                }
                static compareKeys(a, b) {
                    if (a[0] > b[0]) {
                        return 1;
                    }
                    else if (a[0] < b[0]) {
                        return -1;
                    }
                    else {
                        if (a[1] > b[1]) {
                            return 1;
                        }
                        if (a[1] < b[1]) {
                            return -1;
                        }
                        else {
                            return 0;
                        }
                    }
                }
                initialize() {
                    let cells = this.map.cells;
                    for (let i = 0; i < cells.length; i++) {
                        cells[i].distance = Number.POSITIVE_INFINITY;
                        cells[i].rhs = Number.POSITIVE_INFINITY;
                    }
                    this.start.rhs = 0;
                    this.openCells.insert(this.start, this.calcKey(this.start));
                }
                run() {
                    this.initialize();
                    this.computeShortestPath();
                    this.paintShortestPath();
                    this.isInitialized = true;
                }
                paintShortestPath() {
                    if (!Number.isFinite(this.goal.distance)) {
                        return;
                    }
                    this.map.cells.forEach(cell => {
                        if (Number.isFinite(cell.distance) && cell.isFree) {
                            cell.type = index_1.CellType.Visited;
                        }
                    });
                    let node = this.goal;
                    let nodeDistance = (cell) => cell.distance;
                    do {
                        let predecessors = this.getNeighbors(node, (x) => !x.isBlocked)
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
                    } while (node !== this.start);
                }
                calcKey(cell) {
                    let k2 = Math.min(cell.distance, cell.rhs);
                    let k1 = k2 + this.distance(cell, this.goal);
                    return [Math.round(k1), Math.round(k2)];
                }
                updateVertex(cell) {
                    if (cell !== this.start) {
                        let predecessorsRhsValues = this.getNeighbors(cell, this.neighborsFilter)
                            .map(x => x.distance + this.distance(x, cell));
                        cell.rhs = Math.min(...predecessorsRhsValues);
                    }
                    if (this.openCells.has(cell)) {
                        this.openCells.remove(cell);
                    }
                    if (cell.distance !== cell.rhs) {
                        this.openCells.insert(cell, this.calcKey(cell));
                    }
                }
                computeShortestPath() {
                    while (LpaStar.compareKeys(this.calcKey(this.goal), this.openCells.topKey()) === 1 ||
                        this.goal.distance !== this.goal.rhs) {
                        let item = this.openCells.pop();
                        if (item.distance > item.rhs) {
                            item.distance = item.rhs;
                            this.getNeighbors(item, this.neighborsFilter).forEach(x => this.updateVertex(x));
                        }
                        else {
                            item.distance = Number.POSITIVE_INFINITY;
                            let itemAndNeighbors = this.getNeighbors(item, this.neighborsFilter);
                            itemAndNeighbors.push(item);
                            itemAndNeighbors.forEach(x => this.updateVertex(x));
                        }
                    }
                }
                mapUpdate(cells) {
                    let updateList = new Array();
                    cells.forEach(cell => {
                        if (cell.isFree) {
                            cell.distance = Number.POSITIVE_INFINITY;
                            updateList.push(cell);
                        }
                        else {
                            updateList.push(...this.getNeighbors(cell, this.neighborsFilter));
                        }
                    });
                    updateList.forEach(cell => this.updateVertex(cell));
                    this.computeShortestPath();
                    this.paintShortestPath();
                }
            };
            exports_1("LpaStar", LpaStar);
        }
    }
});
//# sourceMappingURL=LpaStar.js.map