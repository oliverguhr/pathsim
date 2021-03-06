import { GAAStar } from './algorithm/GAAStar';
import { LpaStar, AStar, Dijkstra, Distance, MPGAAStar } from "./algorithm/index";
import { Map, Moveable, CellType, Position, Cell } from "./grid/index";
import { DynmicObstacleGenerator, MazeGenerator, PathCostVisualizer, ObstacleGenerator } from "./tools/index";
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
            if (map.robotIsMoving) {
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
            } else {
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

        let onMapUpdate = (cell: Cell) => { pathFinder.observe(cell) };
        map.map.notifyOnChange(onMapUpdate);

        let start = map.map.getStartCell() as Cell;
        let goal = map.map.getGoalCell();
        let lastPosition:Cell;

        let interval = $interval(() => {
            //cleanup old visited cells, to show which cells are calculated by the algorithm 
            map.map.cells.filter((x:Cell) => x.isVisited).forEach((x:Cell) =>{ x.type = CellType.Free; x.color = undefined});
            
            let nextCell = pathFinder.calculatePath(start, goal) as Cell;            
            start = nextCell;
            if (start.isGoal) {
                $interval.cancel(interval);
                map.map.removeChangeListener(onMapUpdate);
                map.robotIsMoving = false;
            } else {
                map.visualizePathCosts();
                if(lastPosition !== undefined)
                {
                    lastPosition.cellType = CellType.Free;
                    lastPosition.color = undefined;
                }

                nextCell.cellType = CellType.Visited;
                nextCell.color = "#ee00f2";
                lastPosition=nextCell;
                
            }
            map.calculateStatistic();

        }, map.robotStepInterval);
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
        map.calculatePath();
    };

    map.addWalls = () => {
        map.map.resetPath();
        map.algorithmInstance = undefined;
        let generator = new MazeGenerator(map.map);
        generator.createMaze();
        map.algorithmInstance = map.getAlgorithmInstance();
        map.calculatePath();
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

    map.calculatePath = () => {
        let pathFinder = map.getAlgorithmInstance();
        if (pathFinder.isInitialized === undefined || pathFinder.isInitialized === false) {
            console.time(map.algorithm);
            // console.profile("Dijkstra");
            pathFinder.run();
            // console.profileEnd("Dijkstra");
            console.timeEnd(map.algorithm);
        }
        map.visualizePathCosts();
        map.calculateStatistic();
    };

    map.calculateStatistic = () => {
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
        map.calculatePath();
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
            case "GAAStar":
                algorithm = new GAAStar(map.map, 500);
                break;
            default:
                algorithm = new MPGAAStar(map.map, 500);
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
                algorithm.distance = Distance.euclid;
        }

        map.algorithmInstance = algorithm;
        return algorithm;
    };

});

angular.bootstrap(document.documentElement, ["pathsim"]);
