import * as _ from "lodash";
import { Map, Moveable, CellType, Cell, Position } from "./grid/index";


export class ObstacleGenerator {
    constructor(private map: Map) {}

    addRandomObstacles(count:number) {
        //apply some magic to count free cells
        var freeCells = this.map.cells.reduce(
            (prev, curr) => {
                if (curr.isBlockable) prev++;
                return prev;
            }, 0);
        if (count > freeCells)
            count = freeCells;

        for (var i = 0; i < count; i++) {
            let row = _.random(0, this.map.rows - 1);
            let col = _.random(0, this.map.cols - 1);

            if (this.map.grid[row][col].isBlockable) {
                this.map.grid[row][col].type = CellType.Blocked;
                //this.map.hasChanged(this.map.grid[row][col]);
            } else {
                i--;
            }
        }
    }
}
