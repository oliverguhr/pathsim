"use strict";
(function (CellType) {
    CellType[CellType["Free"] = 0] = "Free";
    CellType[CellType["Blocked"] = 1] = "Blocked";
    CellType[CellType["Visited"] = 2] = "Visited";
    CellType[CellType["Current"] = 3] = "Current";
    CellType[CellType["Start"] = 4] = "Start";
    CellType[CellType["Goal"] = 5] = "Goal";
})(exports.CellType || (exports.CellType = {}));
var CellType = exports.CellType;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CellType;
//# sourceMappingURL=CellType.js.map