var test = require('tape');
var map = require("../scripts/map.js")

test('create new map', function (t) {

    var map = new Map(10, 10);

    var start = new Moveable(map, CellType.Start);
    start.moveTo(new Position(0, 0));

    var goal = new Moveable(map, CellType.Goal);
    goal.moveTo(new Position(9, 9));
});