System.register(["./PathAlgorithm", "js-priority-queue", "./Distance", "./../tools/index"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var PathAlgorithm_1, PriorityQueue, Distance_1, index_1;
    var MPGAAStar;
    return {
        setters:[
            function (PathAlgorithm_1_1) {
                PathAlgorithm_1 = PathAlgorithm_1_1;
            },
            function (PriorityQueue_1) {
                PriorityQueue = PriorityQueue_1;
            },
            function (Distance_1_1) {
                Distance_1 = Distance_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            }],
        execute: function() {
            class MPGAAStar extends PathAlgorithm_1.PathAlgorithm {
                constructor(map, visibiltyRange) {
                    super();
                    this.visibiltyRange = visibiltyRange;
                    let queueConfig = {
                        comparator: (a, b) => a.estimatedDistance - b.estimatedDistance,
                    };
                    this.map = map;
                    this.closedCells = new Array();
                    this.openCells = new PriorityQueue.ArrayStrategy(queueConfig);
                    this.goal = this.map.getGoalCell();
                    this.start = this.map.getStartCell();
                    this.currentCell = this.start;
                    this.searches = new index_1.TypMappedDictionary(cell => this.map.getIndexOfCell(cell), 0);
                    this.next = new index_1.TypMappedDictionary(cell => this.map.getIndexOfCell(cell));
                    this.parent = new index_1.TypMappedDictionary(cell => this.map.getIndexOfCell(cell));
                }
                run() {
                    this.counter = 0;
                    this.observe(this.start);
                    this.map.cells.forEach(cell => {
                        this.searches.set(cell, 0);
                        cell.estimatedDistance = this.distance(cell, this.goal);
                        this.next.delete(cell);
                    });
                    while (this.start !== this.goal) {
                        this.counter++;
                        let s = this.aStar(this.start);
                        if (s === null) {
                            throw new Error("goal is not reachable");
                        }
                        let cells = this.getNeighbors(s, (x) => this.closedCells.indexOf(x) !== -1);
                        cells.forEach(cell => {
                            cell.estimatedDistance = s.distance + s.estimatedDistance - cell.distance;
                        });
                        this.buildPath(s);
                    }
                }
                buildPath(s) {
                    while (s !== this.start) {
                        let parent = this.parent.get(s);
                        this.next.set(parent, s);
                        s = parent;
                    }
                }
                aStar(init) {
                    return null;
                }
                reestablishConsitency() {
                }
                observe(start) {
                    this.map.notifyOnChange(changedCell => {
                        let distance = Distance_1.Distance.euklid(changedCell, this.currentCell);
                        if (distance < this.visibiltyRange) {
                            let oldDistance = changedCell.distance;
                            if (changedCell.isBlocked) {
                                changedCell.distance = Number.POSITIVE_INFINITY;
                            }
                            else {
                                changedCell.distance = changedCell.previous.distance +
                                    this.distance(changedCell, changedCell.previous);
                            }
                            if (changedCell.distance > oldDistance) {
                                this.next.delete(changedCell);
                            }
                            if (changedCell.distance < oldDistance) {
                                this.reestablishConsitency();
                            }
                        }
                    });
                }
            }
            exports_1("MPGAAStar", MPGAAStar);
        }
    }
});
//# sourceMappingURL=MPGAAStar.js.map