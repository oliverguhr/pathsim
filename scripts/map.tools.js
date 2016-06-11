class DynmicObstacleGenerator {
    constructor(map) {
        this.map = map;
        this.robots = [];
    }

    add() {
        let robot = new Moveable(this.map, CellType.Blocked);
        robot.moveTo(this.getRandomPosition());
        robot.currentCell.color = '#BBF';
        this.robots.push(robot);
    }

    update() {
        for (let robot of this.robots) {
            let y;
            let x;
            do {
                y = robot.position.y + _.random(-1, 1);
                x = robot.position.x + _.random(-1, 1);
            } while (!this.isPositionFree(x, y));
            robot.currentCell.color = undefined;
            robot.moveTo(new Position(x, y));
            robot.currentCell.color = '#BBF';
        }
    }

    isPositionFree(x, y) {
        var cell = this.map.getCell(x, y);
        if (cell !== undefined) {
            return cell.isFree || cell.isVisited || cell.isCurrent;
        }
        return false;
    }

    getRandomPosition() {
        let y;
        let x;
        do {
            y = _.random(0, this.map.rows - 1);
            x = _.random(0, this.map.cols - 1);
        } while (!this.isPositionFree(x, y));

        return new Position(x, y);
    }
}


class ObstacleGenerator {
    constructor(map) {
        this.map = map;
    }

    addRandomObstacles(count) {
        //apply some magic to count free cells
        var freeCells = this.map.cells.reduce(
            (prev, curr) => {
                if (curr.isFree) prev++;
                return prev;
            }, 0);

        if (count > freeCells)
            count = freeCells;

        for (var i = 0; i < count; i++) {
            let row = _.random(0, this.map.rows - 1);
            let col = _.random(0, this.map.cols - 1);

            if (this.map.grid[row][col].isFree) {
                this.map.grid[row][col].type = CellType.Blocked;
                this.map.hasChanged(this.map.grid[row][col]);
            } else {
                i--;
            }
        }
    }
}

class MazeGenerator {
    constructor(map) {
        this.map = map;
    }

    createMaze(walls = 5, minDistanceBetweenWalls = 5){
        for (var i = 0; i < walls; i++) {
            this.generateRandomWall(minDistanceBetweenWalls);
        }
    }

    generateRandomWall(minDistanceBetweenWalls)
    {
            // will this be a vertical line or a horizontal
            let vertical = _.random(0, 1);

            let stepsY = this.map.rows / minDistanceBetweenWalls;
            let stepsX = this.map.cols / minDistanceBetweenWalls;

            let y = Math.round((this.map.rows/stepsY) * _.random(1, stepsY -1));
            let x = Math.round((this.map.cols/stepsX) * _.random(1, stepsX -1));

            console.log("map x=60 y=35 rand x"+x+" y="+y+ "steps  x="+stepsX +" y="+stepsY);
            let postionStart, postionEnd;
            if(vertical === 1)
            {
                postionStart = new Position(0,y);
                postionEnd = new Position(this.map.cols,y);
            }
            else {
              postionStart = new Position(x,0);
              postionEnd = new Position(x,this.map.rows);
            }

            this.drawWall(postionStart, postionEnd);
    }

    drawWall(positionStart,positionEnd){
        let diffX = positionEnd.x - positionStart.x;
        let diffY = positionEnd.y - positionStart.y;

        let cell;
        for (var i = 0; i < diffX; i++) {
          cell = this.map.grid[positionStart.y][positionStart.x+i];          
          if ( cell.isFree) {
              cell.type = CellType.Blocked;
              this.map.hasChanged([positionStart.y][positionStart.x+i]);
          }
          else if (cell.isBlocked) {
            //throw a coin if we go ahead or stop here
            if(_.random(0, 1) ===1)
            {
              break;
            }
          }
        }
        //add a door
        if(diffX!==0)
          this.map.grid[positionStart.y][positionStart.x+_.random(0, i)].type = CellType.Free;


        for (i = 0; i < diffY; i++) {
          cell = this.map.grid[positionStart.y+i][positionEnd.x];
          if (cell.isFree) {
              cell.type = CellType.Blocked;
              this.map.hasChanged([positionStart.y+i][positionEnd.x]);
          }
          else if (cell.isBlocked) {
            //throw a coin if we go ahead or stop here
            if(_.random(0, 1) ===1)
            {
              break;
            }
          }
        }
      //add a door
      if(diffY!==0)
        this.map.grid[positionStart.y+_.random(0,i)][positionEnd.x].type = CellType.Free;
    }

}


class PathCostVisualizer {
    constructor(map) {
        this.map = map;
    }

    paint() {
        var distanceMulti = 1 / _.maxBy(this.map.cells.filter(cell => cell.isVisited && Number.isFinite(cell.distance)), cell => cell.distance).distance;

        this.map.cells.filter(cell => cell.isVisited).forEach(cell => {
            cell.color = this.numberToColorHsl(1 - (cell.distance * distanceMulti), 0, 1);
        });
    }

    /**
     * Convert a number to a color using hsl, with range definition.
     * Example: if min/max are 0/1, and i is 0.75, the color is closer to green.
     * Example: if min/max are 0.5/1, and i is 0.75, the color is in the middle between red and green.
     * @param i (floating point, range 0 to 1)
     * param min (floating point, range 0 to 1, all i at and below this is red)
     * param max (floating point, range 0 to 1, all i at and above this is green)
     */
    numberToColorHsl(i, min, max) {
            var ratio = i;
            if (min > 0 || max < 1) {
                if (i < min) {
                    ratio = 0;
                } else if (i > max) {
                    ratio = 1;
                } else {
                    var range = max - min;
                    ratio = (i - min) / range;
                }
            }

            // as the function expects a value between 0 and 1, and red = 0° and green = 120°
            // we convert the input to the appropriate hue value
            var hue = ratio * 1.2 / 3.60;
            //if (minMaxFactor!=1) hue /= minMaxFactor;
            //console.log(hue);

            // we convert hsl to rgb (saturation 100%, lightness 50%)
            var rgb = this.hslToRgb(hue, 1, 0.5);
            // we format to css value and return
            return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
        }
        hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }
        /**
         * http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
         *
         * Converts an HSL color value to RGB. Conversion formula
         * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
         * Assumes h, s, and l are contained in the set [0, 1] and
         * returns r, g, and b in the set [0, 255].
         *
         * @param   Number  h       The hue
         * @param   Number  s       The saturation
         * @param   Number  l       The lightness
         * @return  Array           The RGB representation
         */
    hslToRgb(h, s, l) {
        var r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = this.hue2rgb(p, q, h + 1 / 3);
            g = this.hue2rgb(p, q, h);
            b = this.hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
    }
}
