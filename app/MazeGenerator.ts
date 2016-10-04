import * as _ from "lodash";
import { Map, Moveable, CellType, Cell,Position } from "./grid/index";


export class MazeGenerator {
    constructor(private map:Map) {}

    createMaze(walls = 5, minDistanceBetweenWalls = 5) {
        for (var i = 0; i < walls; i++) {
            this.generateRandomWall(minDistanceBetweenWalls);
        }
    }

    private generateRandomWall(minDistanceBetweenWalls:number) {
        // will this be a vertical line or a horizontal
        let vertical = _.random(0, 1);

        let stepsY = this.map.rows / minDistanceBetweenWalls;
        let stepsX = this.map.cols / minDistanceBetweenWalls;

        let y = Math.round((this.map.rows / stepsY) * _.random(1, stepsY - 1));
        let x = Math.round((this.map.cols / stepsX) * _.random(1, stepsX - 1));

        console.log("map x=60 y=35 rand x" + x + " y=" + y + "steps  x=" + stepsX + " y=" + stepsY);
        let postionStart : Position, postionEnd:Position;
        if (vertical === 1) {
            postionStart = new Position(0, y);
            postionEnd = new Position(this.map.cols, y);
        } else {
            postionStart = new Position(x, 0);
            postionEnd = new Position(x, this.map.rows);
        }

        this.drawWall(postionStart, postionEnd);
    }

    private drawWall(positionStart:Position, positionEnd:Position) {
        let diffX = positionEnd.x - positionStart.x;
        let diffY = positionEnd.y - positionStart.y;
        let lastDoor = 0;

        let cell:Cell;
        for (var i = 0; i < diffX; i++) {
            cell = this.map.grid[positionStart.y][positionStart.x + i];
            if (cell.isBlockable) {
                cell.type = CellType.Blocked;
            } else if (cell.isBlocked) {
                //add a door
                this.map.grid[positionStart.y][positionStart.x + _.random(lastDoor, i - 1)].type = CellType.Free;
                lastDoor = i;
                //throw a coin if we go ahead or stop here
                if (_.random(0, 1) === 1) {
                    break;
                }
            }
        }
        lastDoor = 0;
        for (i = 0; i < diffY; i++) {
            cell = this.map.grid[positionStart.y + i][positionEnd.x];
            if (cell.isBlockable) {
                cell.type = CellType.Blocked;
            } else if (cell.isBlocked) {
                //add a door
                //if(diffY!==0)
                this.map.grid[positionStart.y + _.random(lastDoor, i - 1)][positionEnd.x].type = CellType.Free;
                lastDoor = i;
                //throw a coin if we go ahead or stop here
                if (_.random(0, 1) === 1) {
                    break;
                }
            }
        }
    }

}
