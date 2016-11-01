System.register(["./MPGAAStar", "../grid/index"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var MPGAAStar_1, index_1;
    return {
        setters:[
            function (MPGAAStar_1_1) {
                MPGAAStar_1 = MPGAAStar_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            }],
        execute: function() {
            describe("MPGAAStar", () => {
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
                        let algorithm = new MPGAAStar_1.MPGAAStar(map, 300);
                        algorithm.run();
                    });
                });
            });
        }
    }
});
//# sourceMappingURL=MPGAAStar.test.js.map