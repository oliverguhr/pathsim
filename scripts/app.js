var app = angular.module('pathsim', []);

/* Change map from regular js
angular.element($0).scope().$apply((scope) => {scope.map.map[0][0].isBlocked = scope.map.map[0][0].isBlocked!})
*/

app.controller('MapController', function ($attrs, $interval) {
    var map = this;
    map.name = "test";
    map.cols = $attrs.cols;
    map.rows = $attrs.rows;
    map.robots = undefined;
    map.algorithm = "AStar";


    map.initializeMap = () => {
        map.map = new Map(map.rows, map.cols);
        // map.map.notifyOnChange(cell => console.log(cell.position.toString(), cell));

        var start = new Moveable(map.map, CellType.Start);
        start.moveTo(new Position(Math.round($attrs.cols / 4), Math.round($attrs.rows / 2)));

        var goal = new Moveable(map.map, CellType.Goal);
        goal.moveTo(new Position(Math.round(($attrs.cols / 4) * 3), Math.round($attrs.rows / 2)));

        map.cellSize = 25;
        map.widthPx = map.map.cols * map.cellSize;
        map.heightPx = map.map.rows * map.cellSize;
    };
    map.initializeMap();


    map.cleanMap = () => {
        map.map.resetPath();
        map.map.resetBlocks();
        map.clearRobots();
    };
    map.runStepByStep = () => {
        map.map.resetPath();
        map.clearRobots();
        let pathFinder = map.getAlgorithmInstance();

        var intervall = $interval(() => {
            if (!pathFinder.step()) {
                $interval.cancel(intervall);
            }
            else {
              map.visualizePath();
            }
        }, 10);
    };

    map.visualizePath = () => {
        if (map.isVisualizePathEnabled === true) {
            let visual = new PathCostVisualizer(map.map);
            visual.paint();
        }
    };

    map.addRandomObstacles = () => {
        map.map.resetPath();
        let generator = new ObstacleGenerator(map.map);
        generator.addRandomObstacles((map.map.cols * map.map.rows) * 0.1);
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
            map.map.resetPath();
            map.robots.update();
            map.calulatePath();
        }, 800);
    };

    map.clearRobots = () => {
        $interval.cancel(map.robotIntervall);
        if(map.robots !== undefined)
          map.robots.robots.forEach( robot => map.map.getCell(robot.position.x,robot.position.y).cellType = 0);
        map.robots = undefined;
    };

    map.calulatePath = () => {
        console.time(map.algorithm);
        //console.profile("Dijkstra");
        let pathFinder = map.getAlgorithmInstance();
        pathFinder.run();
        //console.profileEnd("Dijkstra");
        console.timeEnd(map.algorithm);

        map.visualizePath();
    };

    map.clickOnCell = (cell) => {
        map.map.resetPath();
        switch (cell.type) {
        case CellType.Blocked:
            cell.type = CellType.Free;
            break;
        case CellType.Free:
            cell.type = CellType.Blocked;
            break;
        default:
        }
        this.map.updateCell(cell);
        map.calulatePath();
    };

    map.mouseOverCell = (cell, event) => {
        if (event.buttons == 1) {
            this.clickOnCell(cell);
        }
    };

    map.getAlgorithmInstance = () => {
        switch (map.algorithm) {
          case 'Dijkstra':
              return new Dijkstra(map.map);
          default:
            return new AStar(map.map);
        }
    };

});

function AStarTest(){

  let cells = Math.round(Math.sqrt(80000));

  let map = new Map(cells, cells);

  var start = new Moveable(map, CellType.Start);
  start.moveTo(new Position(Math.round(cells / 4), Math.round(cells / 2)));

  var goal = new Moveable(map, CellType.Goal);
  goal.moveTo(new Position(Math.round((cells / 4) * 3), Math.round(cells / 2)));

  let generator = new ObstacleGenerator(map);
  generator.addRandomObstacles((map.cols * map.rows) * 0.5);



  let astar = new AStar(map);

  console.time("astar");
  //console.profile("astar");
  astar.run();
  //console.profileEnd("astar");
  console.timeEnd("astar");
}
