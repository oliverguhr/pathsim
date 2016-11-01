System.register(["./index"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var index_1;
    return {
        setters:[
            function (index_1_1) {
                index_1 = index_1_1;
            }],
        execute: function() {
            describe("The map", () => {
                let map;
                beforeEach(function () {
                    let cells = 5;
                    map = new index_1.Map(cells, cells);
                    let start = new index_1.Moveable(map, index_1.CellType.Start);
                    start.moveTo(new index_1.Position(Math.round(cells / 4), Math.round(cells / 2)));
                    let goal = new index_1.Moveable(map, index_1.CellType.Goal);
                    goal.moveTo(new index_1.Position(Math.round((cells / 4) * 3), Math.round(cells / 2)));
                });
                describe("getIndexOfCell", () => {
                    it("should return the correct index", () => {
                        let cell = map.getCell(1, 1);
                        if (map.getIndexOfCell(cell) !== map.cells.indexOf(cell)) {
                            throw new Error("Index of goal cell is " + map.getIndexOfCell(cell) + " but should be " + map.cells.indexOf(cell));
                        }
                    });
                });
            });
        }
    }
});
//# sourceMappingURL=Map.test.js.map