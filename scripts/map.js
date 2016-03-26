/*jshint esversion: 6 */

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

    for (var i = 0; i < count; i++) {
      var row = Random.getRandomInt(0, this.rows - 1);
      var col = Random.getRandomInt(0, this.cols - 1);
      this.grid[row][col].isBlocked = true;
    }
  }

  setStart(row, col){
      this.grid[row][col].isStart = true;
  }
  setGoal(row, col){
      this.grid[row][col].isGoal = true;
  }

}

class Cell {
  constructor(row, col, isBlocked = false) {
    this.row = row;
    this.col = col;

    this.isBlocked = isBlocked;
    this.isClosed = false;
    this.isCurrent = false;
    this.isStart = false;
    this.isGoal = false;
  }
}

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
