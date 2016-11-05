import {LpaStar, AStar, Dijkstra, Distance, MPGAAStar} from "./algorithm/index";
import { Map, Moveable, CellType, Position, Cell } from "./grid/index";
import {DynmicObstacleGenerator, MazeGenerator, PathCostVisualizer, ObstacleGenerator} from "./tools/index";
import * as angular from "angular";

/* Change map from regular js
angular.element($0).scope().$apply((scope) => {scope.map.map[0][0].isBlocked = scope.map.map[0][0].isBlocked!})
angular.element($0).scope().$apply((scope) => {console.log(scope)})
*/

export var app = angular.module("pathsim", []);

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

    map.initializeMap = (predefinedMap: Map) => {
        if (predefinedMap === undefined) {
            map.map = new Map(map.rows, map.cols);

            map.start = new Moveable(map.map, CellType.Start);
            map.start.moveTo(new Position(Math.round($attrs.cols / 4), Math.round($attrs.rows / 2)));

            map.goal = new Moveable(map.map, CellType.Goal);
            map.goal.moveTo(new Position(Math.round(($attrs.cols / 4) * 3), Math.round($attrs.rows / 2)));

        } else {
            map.map = predefinedMap;
        }

        map.cellSize = 25;
        map.widthPx = map.map.cols * map.cellSize;
        map.heightPx = map.map.rows * map.cellSize;

        map.map.notifyOnChange((cell: Cell) => {
            if(map.robotIsMoving){
                return;
            }            

            try {
                map.algorithmInstance = map.getAlgorithmInstance();
            } catch (e) {
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
            } else {
                map.visualizePathCosts();
            }
            map.calulateStatistic();
        }, 10);
    };

    map.robotStepIntervall = 500;
    map.robotIsMoving = false;
    map.startRobot = () => {
        map.robotIsMoving = true;
        map.map.resetPath();
        let pathFinder = map.getAlgorithmInstance();

        map.map.notifyOnChange((cell:Cell) => {pathFinder.observe(cell)});

        let start = map.map.getStartCell();
        let goal = map.map.getGoalCell();

        let intervall = $interval(() => {
            //cleanup old paths.. they just mess up the ui
            map.map.cells.filter((x:Cell) => x.isCurrent).forEach((x:Cell) => x.type = CellType.Free);
            let nextCell =pathFinder.calulatePath(start,goal);
            start = nextCell;
            if (nextCell.isGoal) {
                $interval.cancel(intervall);
                map.robotIsMoving = false;
            } else {                                 
                map.visualizePathCosts();
            }
            map.calulateStatistic();

        }, map.robotStepIntervall);
    }

    map.visualizePathCosts = () => {
        if (map.isVisualizePathEnabled === true) {
            let visual = new PathCostVisualizer(map.map);
            visual.paint();
        }
    };

    map.addRandomObstacles = () => {
        map.map.resetPath();
        map.algorithmInstance = undefined;
        let generator = new ObstacleGenerator(map.map);
        generator.addRandomObstacles((map.map.cols * map.map.rows) * 0.1);
        map.algorithmInstance = map.getAlgorithmInstance();
        map.calulatePath();
    };

    map.addWalls = () => {
        map.map.resetPath();
        map.algorithmInstance = undefined;
        let generator = new MazeGenerator(map.map);
        generator.createMaze();
        map.algorithmInstance = map.getAlgorithmInstance();
        map.calulatePath();
    };

    map.addDynamicObstacle = () => {
        if (map.robots === undefined) {
            map.robots = new DynmicObstacleGenerator(map.map);
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
            map.robots.robots.forEach(
                (robot: Cell) => map.map.getCell(robot.position.x, robot.position.y).cellType = 0
            );
        }
        map.robots = undefined;
    };

    map.calulatePath = () => {
        let pathFinder = map.getAlgorithmInstance();
        if (pathFinder.isInitialized === undefined || pathFinder.isInitialized === false) {
            console.time(map.algorithm);
            // console.profile("Dijkstra");
            pathFinder.run();
            // console.profileEnd("Dijkstra");
            console.timeEnd(map.algorithm);
        }
        map.visualizePathCosts();
        map.calulateStatistic();
    };

    map.calulateStatistic = () => {
        map.stat.pathLength = map.map.cells.filter((x: Cell) => x.isCurrent).length;
        map.stat.visitedCells = map.stat.pathLength + map.map.cells.filter((x: Cell) => x.isVisited).length;
    };

    map.editStartCell = false;
    map.editGoalCell = false;
    map.clickOnCell = (cell: Cell) => {
        if (map.editStartCell) {
            map.start.moveTo(cell.position);
            map.editStartCell = false;
        } else if (map.editGoalCell) {
            map.goal.moveTo(cell.position);
            map.editGoalCell = false;
        } else {
            switch (cell.type) {
                case CellType.Blocked:
                    cell.type = CellType.Free;
                    break;
                case CellType.Current:
                case CellType.Visited:
                case CellType.Free:
                    cell.color = undefined;
                    cell.type = CellType.Blocked;
                    break;
                case CellType.Start:
                    map.editStartCell = true;
                    break;
                case CellType.Goal:
                    map.editGoalCell = true;
                    break;
                default:
            }
            this.map.updateCell(cell);
        }
    };

    map.mouseOverCell = (cell: Cell, event: any) => {
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
        let algorithm: any;
        switch (map.algorithm) {
            case "Dijkstra":
                algorithm = new Dijkstra(map.map);
                break;
            case "LpaStar":
                if (map.algorithmInstance instanceof LpaStar) {
                    algorithm = map.algorithmInstance;
                } else {
                    algorithm = new LpaStar(map.map);
                }
                break;
            case "AStar":
                algorithm = new AStar(map.map);
                break;
            default:                
                    algorithm = new MPGAAStar(map.map, 5);                
                break;
        }

        switch (map.distance) {
            case "manhattan":
                algorithm.distance = Distance.manhattan;
                break;
            case "diagonalShortcut":
                algorithm.distance = Distance.diagonalShortcut;
                break;
            default:
                algorithm.distance = Distance.euklid;
        }

        map.algorithmInstance = algorithm;
        return algorithm;
    };

});

angular.bootstrap(document.documentElement, ["pathsim"]);
