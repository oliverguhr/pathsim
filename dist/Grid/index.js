System.register(["./Map", "./Moveable", "./Cell", "./CellType", "./Position"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters:[
            function (Map_1_1) {
                exportStar_1(Map_1_1);
            },
            function (Moveable_1_1) {
                exportStar_1(Moveable_1_1);
            },
            function (Cell_1_1) {
                exportStar_1(Cell_1_1);
            },
            function (CellType_1_1) {
                exportStar_1(CellType_1_1);
            },
            function (Position_1_1) {
                exportStar_1(Position_1_1);
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=index.js.map