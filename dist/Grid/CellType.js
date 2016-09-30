System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CellType;
    return {
        setters:[],
        execute: function() {
            (function (CellType) {
                CellType[CellType["Free"] = 0] = "Free";
                CellType[CellType["Blocked"] = 1] = "Blocked";
                CellType[CellType["Visited"] = 2] = "Visited";
                CellType[CellType["Current"] = 3] = "Current";
                CellType[CellType["Start"] = 4] = "Start";
                CellType[CellType["Goal"] = 5] = "Goal";
            })(CellType || (CellType = {}));
            exports_1("CellType", CellType);
            exports_1("default",CellType);
        }
    }
});
//# sourceMappingURL=CellType.js.map