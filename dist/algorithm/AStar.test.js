System.register(["./AStar", "../grid/index"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var AStar_1, index_1;
    return {
        setters:[
            function (AStar_1_1) {
                AStar_1 = AStar_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            }],
        execute: function() {
            describe("AStar", () => {
                let map;
                beforeEach(function () {
                    let cells = Math.round(Math.sqrt(1000));
                    map = new index_1.Map(cells, cells);
                    let start = new index_1.Moveable(map, index_1.CellType.Start);
                    start.moveTo(new index_1.Position(Math.round(cells / 4), Math.round(cells / 2)));
                    let goal = new index_1.Moveable(map, index_1.CellType.Goal);
                    goal.moveTo(new index_1.Position(Math.round((cells / 4) * 3), Math.round(cells / 2)));
                    return map;
                });
                describe("pathfinding", () => {
                    it("should be successful on a empty map", () => {
                        let astar = new AStar_1.AStar(map);
                        astar.run();
                    });
                });
            });
        }
    }
});
//# sourceMappingURL=AStar.test.js.map