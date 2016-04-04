/*jshint esversion: 6 */
var app = angular.module('pathsim', []);


/* Change map from regular js
angular.element($0).scope().$apply((scope) => {scope.map.map[0][0].isBlocked = scope.map.map[0][0].isBlocked!})
*/

app.controller('MapController', function ($attrs) {
    var map = this;
    map.name = "test";

    map.map = new Map($attrs.rows, $attrs.cols);
    map.map.notifyOnChange(cell => console.log(cell.position.toString(), cell));

    var start = new Moveable(map.map, CellType.Start);
    start.moveTo(new Position(Math.round($attrs.cols / 4), Math.round($attrs.rows / 2)));

    var goal = new Moveable(map.map, CellType.Goal);
    goal.moveTo(new Position(Math.round(($attrs.cols / 4) * 3), Math.round($attrs.rows / 2)));

    map.cellSize = 25;
    map.widthPx = map.map.cols * map.cellSize;
    map.heightPx = map.map.rows * map.cellSize;



    map.addRandomObstacles = () => {
        map.map.reset();
        map.map.addRandomObstacles((map.map.cols * map.map.rows) * 0.1);
        map.calulatePath();
    };

    map.calulatePath = () => {
        console.time("Dijkstra");
        var pathFinder = new Dijkstra(map.map);
        pathFinder.run();
        console.timeEnd("Dijkstra");
    };

    map.clickOnCell = (cell) => {
        map.map.reset();
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
            this.clickOnCell(cell)
        }
    };

});