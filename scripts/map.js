/*jshint esversion: 6 */

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Moveable {
  constructor(map, cellType) {

    this.cellType = cellType;
    this.map = map;
    this.position = undefined;
  }

  moveTo(position) {
    if (this.position !== undefined) {
      this.map.grid[this.position.x][this.position.y].type = CellType.Free;
    }
    this.position = position;
    this.map.grid[position.x][position.y].type = this.cellType;
  }
}


class Map {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;

    this.grid = [
      []
    ];

    this.initializeGrid();
  }

  initializeGrid() {
    for (var row = 0; row < this.rows; row++) {
      this.grid.push([]);
      for (var col = 0; col < this.cols; col++) {
        this.grid[row].push(new Cell(row, col));
      }
    }
  }

  addRandomObstacles(count) {
    //flattens the grid
    var cells = [].concat.apply([], this.grid);
    //apply some magic to count free cells
    var freeCells = cells.reduce(
      (prev, curr) => {
        if (curr.isFree) prev++;
        return prev;
      },0);

    if(count > freeCells)
      count = freeCells;

    for (var i = 0; i < count; i++) {
      var row = Random.getRandomInt(0, this.rows - 1);
      var col = Random.getRandomInt(0, this.cols - 1);

      if (this.grid[row][col].isFree) {
        this.grid[row][col].type = CellType.Blocked;
      } else {
        i--;
      }
    }
  }
}

class Cell {
  constructor(row, col, cellType = CellType.Free) {
    this.row = row;
    this.col = col;
    this.cellType = cellType;
  }

  set type(cellType) {
    this.cellType = cellType;
  }
  get type() {
    return this.cellType;
  }

  get isFree() {
    return this.type === CellType.Free;
  }
  get isBlocked() {
    return this.type === CellType.Blocked;
  }
  get isVisited() {
    return this.type === CellType.Visited;
  }
  get isCurrent() {
    return this.type === CellType.Current;
  }
  get isStart() {
    return this.type === CellType.Start;
  }
  get isGoal() {
    return this.type === CellType.Goal;
  }
}

var CellType = Object.freeze({
  Free: 0,
  Blocked: 1,
  Visited: 2,
  Current: 3,
  Start: 4,
  Goal: 5
});


class Random {
  /**
   * Get a random floating point number between `min` and `max`.
   *
   * @param {number} min - min number
   * @param {number} max - max number
   * @return {float} a random floating point number
   */
  static getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  /**
   * Get a random integer between `min` and `max`.
   *
   * @param {number} min - min number
   * @param {number} max - max number
   * @return {int} a random integer
   */
  static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

}
