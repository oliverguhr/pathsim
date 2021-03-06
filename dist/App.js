System.register(['./algorithm/GAAStar', "./algorithm/index", "./grid/index", "./tools/index", "angular"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var GAAStar_1, index_1, index_2, index_3, angular;
    var app;
    return {
        setters:[
            function (GAAStar_1_1) {
                GAAStar_1 = GAAStar_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (index_2_1) {
                index_2 = index_2_1;
            },
            function (index_3_1) {
                index_3 = index_3_1;
            },
            function (angular_1) {
                angular = angular_1;
            }],
        execute: function() {
            exports_1("app", app = angular.module("pathsim", []));
            app.controller("MapController", function ($attrs, $interval) {
                let map = this;
                map.name = "test";
                map.cols = $attrs.cols;
                map.rows = $attrs.rows;
                map.robots = undefined;
                map.algorithm = "MPGAAStar";
                map.algorithmInstance = undefined;
                map.distance = "euklid";
                map.isVisualizePathEnabled = true;
                map.stat = {};
                map.start = undefined;
                map.goal = undefined;
                map.initializeMap = (predefinedMap) => {
                    if (predefinedMap === undefined) {
                        map.map = new index_2.Map(map.rows, map.cols);
                        map.start = new index_2.Moveable(map.map, index_2.CellType.Start);
                        map.start.moveTo(new index_2.Position(Math.round($attrs.cols / 4), Math.round($attrs.rows / 2)));
                        map.goal = new index_2.Moveable(map.map, index_2.CellType.Goal);
                        map.goal.moveTo(new index_2.Position(Math.round(($attrs.cols / 4) * 3), Math.round($attrs.rows / 2)));
                    }
                    else {
                        map.map = predefinedMap;
                    }
                    map.cellSize = 25;
                    map.widthPx = map.map.cols * map.cellSize;
                    map.heightPx = map.map.rows * map.cellSize;
                    map.map.notifyOnChange((cell) => {
                        if (map.robotIsMoving) {
                            return;
                        }
                        try {
                            map.algorithmInstance = map.getAlgorithmInstance();
                        }
                        catch (e) {
                            console.error(e);
                            return;
                        }
                        map.map.resetPath();
                        if (map.algorithmInstance.isInitialized) {
                            console.time(map.algorithm);
                            map.algorithmInstance.mapUpdate([cell]);
                            console.timeEnd(map.algorithm);
                            map.visualizePathCosts();
                            map.calculateStatistic();
                        }
                        if (map.algorithmInstance.isInitialized === undefined || map.algorithmInstance.isInitialized === false) {
                            map.calculatePath();
                        }
                    });
                };
                map.initializeMap();
                map.cleanMap = () => {
                    map.algorithmInstance = undefined;
                    map.map.resetPath();
                    map.map.resetBlocks();
                    map.clearRobots();
                };
                map.runStepByStep = () => {
                    map.map.resetPath();
                    map.clearRobots();
                    let pathFinder = map.getAlgorithmInstance();
                    let interval = $interval(() => {
                        if (!pathFinder.step()) {
                            $interval.cancel(interval);
                        }
                        else {
                            map.visualizePathCosts();
                        }
                        map.calculateStatistic();
                    }, 10);
                };
                map.robotStepInterval = 500;
                map.robotIsMoving = false;
                map.startRobot = () => {
                    map.robotIsMoving = true;
                    map.map.resetPath();
                    let pathFinder = map.getAlgorithmInstance();
                    let onMapUpdate = (cell) => { pathFinder.observe(cell); };
                    map.map.notifyOnChange(onMapUpdate);
                    let start = map.map.getStartCell();
                    let goal = map.map.getGoalCell();
                    let lastPosition;
                    let interval = $interval(() => {
                        map.map.cells.filter((x) => x.isVisited).forEach((x) => { x.type = index_2.CellType.Free; x.color = undefined; });
                        let nextCell = pathFinder.calculatePath(start, goal);
                        start = nextCell;
                        if (start.isGoal) {
                            $interval.cancel(interval);
                            map.map.removeChangeListener(onMapUpdate);
                            map.robotIsMoving = false;
                        }
                        else {
                            map.visualizePathCosts();
                            if (lastPosition !== undefined) {
                                lastPosition.cellType = index_2.CellType.Free;
                                lastPosition.color = undefined;
                            }
                            nextCell.cellType = index_2.CellType.Visited;
                            nextCell.color = "#ee00f2";
                            lastPosition = nextCell;
                        }
                        map.calculateStatistic();
                    }, map.robotStepInterval);
                };
                map.visualizePathCosts = () => {
                    if (map.isVisualizePathEnabled === true) {
                        let visual = new index_3.PathCostVisualizer(map.map);
                        visual.paint();
                    }
                };
                map.addRandomObstacles = () => {
                    map.map.resetPath();
                    map.algorithmInstance = undefined;
                    let generator = new index_3.ObstacleGenerator(map.map);
                    generator.addRandomObstacles((map.map.cols * map.map.rows) * 0.1);
                    map.algorithmInstance = map.getAlgorithmInstance();
                    map.calculatePath();
                };
                map.addWalls = () => {
                    map.map.resetPath();
                    map.algorithmInstance = undefined;
                    let generator = new index_3.MazeGenerator(map.map);
                    generator.createMaze();
                    map.algorithmInstance = map.getAlgorithmInstance();
                    map.calculatePath();
                };
                map.addDynamicObstacle = () => {
                    if (map.robots === undefined) {
                        map.robots = new index_3.DynmicObstacleGenerator(map.map);
                    }
                    map.robots.add();
                    if (map.robotIntervall !== undefined) {
                        $interval.cancel(map.robotIntervall);
                    }
                    map.robotIntervall = $interval(() => {
                        map.robots.update();
                    }, 800);
                };
                map.clearRobots = () => {
                    $interval.cancel(map.robotIntervall);
                    if (map.robots !== undefined) {
                        map.robots.robots.forEach((robot) => map.map.getCell(robot.position.x, robot.position.y).cellType = 0);
                    }
                    map.robots = undefined;
                };
                map.calculatePath = () => {
                    let pathFinder = map.getAlgorithmInstance();
                    if (pathFinder.isInitialized === undefined || pathFinder.isInitialized === false) {
                        console.time(map.algorithm);
                        pathFinder.run();
                        console.timeEnd(map.algorithm);
                    }
                    map.visualizePathCosts();
                    map.calculateStatistic();
                };
                map.calculateStatistic = () => {
                    map.stat.pathLength = map.map.cells.filter((x) => x.isCurrent).length;
                    map.stat.visitedCells = map.stat.pathLength + map.map.cells.filter((x) => x.isVisited).length;
                };
                map.editStartCell = false;
                map.editGoalCell = false;
                map.clickOnCell = (cell) => {
                    if (map.editStartCell) {
                        map.start.moveTo(cell.position);
                        map.editStartCell = false;
                    }
                    else if (map.editGoalCell) {
                        map.goal.moveTo(cell.position);
                        map.editGoalCell = false;
                    }
                    else {
                        switch (cell.type) {
                            case index_2.CellType.Blocked:
                                cell.type = index_2.CellType.Free;
                                break;
                            case index_2.CellType.Current:
                            case index_2.CellType.Visited:
                            case index_2.CellType.Free:
                                cell.color = undefined;
                                cell.type = index_2.CellType.Blocked;
                                break;
                            case index_2.CellType.Start:
                                map.editStartCell = true;
                                break;
                            case index_2.CellType.Goal:
                                map.editGoalCell = true;
                                break;
                            default:
                        }
                        this.map.updateCell(cell);
                    }
                };
                map.mouseOverCell = (cell, event) => {
                    if (event.buttons === 1) {
                        this.clickOnCell(cell);
                    }
                    map.stat.cell = cell.toString();
                    map.hoveredCell = cell;
                };
                map.changeAlgorithm = () => {
                    map.algorithmInstance = undefined;
                    map.algorithmInstance = map.getAlgorithmInstance();
                    map.map.resetPath();
                    map.calculatePath();
                };
                map.getAlgorithmInstance = () => {
                    let algorithm;
                    switch (map.algorithm) {
                        case "Dijkstra":
                            algorithm = new index_1.Dijkstra(map.map);
                            break;
                        case "LpaStar":
                            if (map.algorithmInstance instanceof index_1.LpaStar) {
                                algorithm = map.algorithmInstance;
                            }
                            else {
                                algorithm = new index_1.LpaStar(map.map);
                            }
                            break;
                        case "AStar":
                            algorithm = new index_1.AStar(map.map);
                            break;
                        case "GAAStar":
                            algorithm = new GAAStar_1.GAAStar(map.map, 500);
                            break;
                        default:
                            algorithm = new index_1.MPGAAStar(map.map, 500);
                            break;
                    }
                    switch (map.distance) {
                        case "manhattan":
                            algorithm.distance = index_1.Distance.manhattan;
                            break;
                        case "diagonalShortcut":
                            algorithm.distance = index_1.Distance.diagonalShortcut;
                            break;
                        default:
                            algorithm.distance = index_1.Distance.euclid;
                    }
                    map.algorithmInstance = algorithm;
                    return algorithm;
                };
            });
            angular.bootstrap(document.documentElement, ["pathsim"]);
        }
    }
});
//# sourceMappingURL=App.js.map