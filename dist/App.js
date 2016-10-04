System.register(["./algorithm/index", "./grid/index", "./MazeGenerator", "./PathCostVisualizer", "./ObstacleGenerator", "./DynmicObstacleGenerator", "angular"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var index_1, index_2, MazeGenerator_1, PathCostVisualizer_1, ObstacleGenerator_1, DynmicObstacleGenerator_1, angular;
    var app;
    return {
        setters:[
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (index_2_1) {
                index_2 = index_2_1;
            },
            function (MazeGenerator_1_1) {
                MazeGenerator_1 = MazeGenerator_1_1;
            },
            function (PathCostVisualizer_1_1) {
                PathCostVisualizer_1 = PathCostVisualizer_1_1;
            },
            function (ObstacleGenerator_1_1) {
                ObstacleGenerator_1 = ObstacleGenerator_1_1;
            },
            function (DynmicObstacleGenerator_1_1) {
                DynmicObstacleGenerator_1 = DynmicObstacleGenerator_1_1;
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
                map.algorithm = "AStar";
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
                            map.calulateStatistic();
                        }
                        if (map.algorithmInstance.isInitialized === undefined || map.algorithmInstance.isInitialized === false) {
                            map.calulatePath();
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
                    let intervall = $interval(() => {
                        if (!pathFinder.step()) {
                            $interval.cancel(intervall);
                        }
                        else {
                            map.visualizePathCosts();
                        }
                        map.calulateStatistic();
                    }, 10);
                };
                map.visualizePathCosts = () => {
                    if (map.isVisualizePathEnabled === true) {
                        let visual = new PathCostVisualizer_1.PathCostVisualizer(map.map);
                        visual.paint();
                    }
                };
                map.addRandomObstacles = () => {
                    map.map.resetPath();
                    map.algorithmInstance = undefined;
                    let generator = new ObstacleGenerator_1.ObstacleGenerator(map.map);
                    generator.addRandomObstacles((map.map.cols * map.map.rows) * 0.1);
                    map.algorithmInstance = map.getAlgorithmInstance();
                    map.calulatePath();
                };
                map.addWalls = () => {
                    map.map.resetPath();
                    map.algorithmInstance = undefined;
                    let generator = new MazeGenerator_1.MazeGenerator(map.map);
                    generator.createMaze();
                    map.algorithmInstance = map.getAlgorithmInstance();
                    map.calulatePath();
                };
                map.addDynamicObstacle = () => {
                    if (map.robots === undefined) {
                        map.robots = new DynmicObstacleGenerator_1.DynmicObstacleGenerator(map.map);
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
                map.calulatePath = () => {
                    let pathFinder = map.getAlgorithmInstance();
                    if (pathFinder.isInitialized === undefined || pathFinder.isInitialized === false) {
                        console.time(map.algorithm);
                        pathFinder.run();
                        console.timeEnd(map.algorithm);
                    }
                    map.visualizePathCosts();
                    map.calulateStatistic();
                };
                map.calulateStatistic = () => {
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
                    map.calulatePath();
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
                        default:
                            algorithm = new index_1.AStar(map.map);
                    }
                    switch (map.distance) {
                        case "manhattan":
                            algorithm.distance = index_1.Distance.manhattan;
                            break;
                        case "diagonalShortcut":
                            algorithm.distance = index_1.Distance.diagonalShortcut;
                            break;
                        default:
                            algorithm.distance = index_1.Distance.euklid;
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