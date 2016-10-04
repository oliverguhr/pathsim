"use strict";
const Distance_1 = require("./Distance");
const index_1 = require('../Grid/index');
const _ = require("lodash");
class PathAlgorithm {
    constructor() {
        this.distance = Distance_1.Distance.euklid;
    }
    getNeighbors(cell, condition) {
        let neighbors = new Array();
        this.addCellIfpassable(cell.position.x + 0, cell.position.y - 1, neighbors, condition);
        this.addCellIfpassable(cell.position.x + 0, cell.position.y + 1, neighbors, condition);
        this.addCellIfpassable(cell.position.x + 1, cell.position.y + 0, neighbors, condition);
        this.addCellIfpassable(cell.position.x - 1, cell.position.y + 0, neighbors, condition);
        this.addCellIfpassable(cell.position.x + 1, cell.position.y + 1, neighbors, condition);
        this.addCellIfpassable(cell.position.x - 1, cell.position.y + 1, neighbors, condition);
        this.addCellIfpassable(cell.position.x + 1, cell.position.y - 1, neighbors, condition);
        this.addCellIfpassable(cell.position.x - 1, cell.position.y - 1, neighbors, condition);
        return neighbors;
    }
    addCellIfpassable(x, y, neighbors, condition) {
        let cell = this.map.getCell(x, y);
        if (cell !== undefined && condition(cell)) {
            neighbors.push(cell);
        }
    }
    paintShortestPath() {
        let start = this.map.getStartCell();
        let node = this.map.getGoalCell();
        let nodeDistance = (cell) => cell.distance;
        do {
            let predecessors = this.getNeighbors(node, (cell) => !cell.isBlocked).filter(node => Number.isFinite(node.distance));
            if (predecessors.length === 0) {
                console.log("path is blocked");
                break;
            }
            node = _.minBy(predecessors, nodeDistance);
            if (node.isVisited) {
                node.type = index_1.CellType.Current;
                node.color = undefined;
            }
        } while (node !== start);
    }
}
exports.PathAlgorithm = PathAlgorithm;
//# sourceMappingURL=PathAlgorithm.js.map