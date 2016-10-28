System.register(["./AStar", "./Dijkstra", "./Distance", "./LpaStar", "./MPGAAStar"], function(exports_1, context_1) {
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
            function (AStar_1_1) {
                exportStar_1(AStar_1_1);
            },
            function (Dijkstra_1_1) {
                exportStar_1(Dijkstra_1_1);
            },
            function (Distance_1_1) {
                exportStar_1(Distance_1_1);
            },
            function (LpaStar_1_1) {
                exportStar_1(LpaStar_1_1);
            },
            function (MPGAAStar_1_1) {
                exportStar_1(MPGAAStar_1_1);
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=index.js.map