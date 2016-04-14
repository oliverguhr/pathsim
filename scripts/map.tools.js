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
            var row = _.random(0, this.map.rows - 1);
            var col = _.random(0, this.map.cols - 1);

            if (this.map.grid[row][col].isFree) {
                this.map.grid[row][col].type = CellType.Blocked;
                this.map.hasChanged(this.map.grid[row][col]);
            } else {
                i--;
            }
        }
    }
}