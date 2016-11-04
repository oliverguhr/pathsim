System.register(["./MPGAAStar", "../grid/index", "../tools/index"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var MPGAAStar_1, index_1, index_2;
    function createMap(size) {
        let map = new index_1.Map(size, size);
        let start = new index_1.Moveable(map, index_1.CellType.Start);
        start.moveTo(new index_1.Position(2, 2));
        let goal = new index_1.Moveable(map, index_1.CellType.Goal);
        goal.moveTo(new index_1.Position(size - 3, size - 3));
        return map;
    }
    return {
        setters:[
            function (MPGAAStar_1_1) {
                MPGAAStar_1 = MPGAAStar_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (index_2_1) {
                index_2 = index_2_1;
            }],
        execute: function() {
            ;
            describe("MPGAAStar", () => {
                let map;
                beforeEach(function () {
                    map = createMap(40);
                });
                function randomBlocksTest(blockedCellPercenatge) {
                    let algorithm = new MPGAAStar_1.MPGAAStar(map, 300);
                    (new index_2.ObstacleGenerator(map)).addRandomObstacles((map.cols * map.rows) * blockedCellPercenatge);
                    algorithm.run();
                }
                describe("pathfinding", () => {
                    it("should be successful on a empty map", () => {
                        let algorithm = new MPGAAStar_1.MPGAAStar(map, 300);
                        algorithm.run();
                    });
                    it("should be successful on a 10% random map", () => { randomBlocksTest(0.1); });
                    it("should be successful on a 20% random map", () => { randomBlocksTest(0.2); });
                    it("should be successful on a 30% random map", () => { randomBlocksTest(0.3); });
                });
            });
        }
    }
});
//# sourceMappingURL=MPGAAStar.test.js.map