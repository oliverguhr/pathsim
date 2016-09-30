import {Distance} from "./Distance";
import {Cell, Map, CellType} from '../Grid/index';
import * as _ from "lodash";

export class PathAlgorithm {
    public distance:Function;
    public map:Map;
    constructor() {
        this.distance = Distance.euklid;
    }
    getNeighbors(cell:Cell, condition:Function) {

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

    addCellIfpassable(x:number, y:number, neighbors:Cell[], condition:Function) {
        let cell = this.map.getCell(x, y);
        if (cell !== undefined && condition(cell)) {
            neighbors.push(cell);
        }
    }


    paintShortestPath() {
        /*let node = this.map.getGoalCell().previous;
        while (node !== undefined) {
          if (node.isVisited) {
            node.type = CellType.Current;
            node.color = undefined;
          }
          node = node.previous;
        }*/
        let start = this.map.getStartCell();
        let node = this.map.getGoalCell();
        let nodeDistance = (cell:Cell) => cell.distance;
        do {
            let predecessors = this.getNeighbors(node, (cell:Cell) => !cell.isBlocked).filter(node => Number.isFinite(node.distance));

            if (predecessors.length === 0) { //deadend
                console.log("path is blocked");
                break;
            }

            node = _.minBy(predecessors, nodeDistance);
            if (node.isVisited) {
                node.type = CellType.Current;
                node.color = undefined;
            }
            //console.log("paint node"+ node.toString());
        } while (node !== start);
    }
}
