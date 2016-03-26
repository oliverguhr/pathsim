/*jshint esversion: 6 */

class Map {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
  }
}

class Renderer {
  constructor(targetElement, map, cellSize) {
    //selector for the element that will contain the map
    this.targetElement = targetElement;
    this.map = map;
    this.cellSize = cellSize;
  }
  renderMap() {
    var svg = d3.select(this.targetElement).append("svg")
      .attr("width", this.map.cols * this.cellSize + 1)
      .attr("height", this.map.rows * this.cellSize + 1);
    d3.range(0, this.map.rows).forEach(row => {
      d3.range(0, this.map.cols).forEach(col => {
        svg.append("rect")
          .attr("x", col * this.cellSize)
          .attr("y", row * this.cellSize)
          .attr("width", this.cellSize)
          .attr("height", this.cellSize)
          .on("mouseover", function() {            
            this.setAttribute("class", "closed");
          })
          .on("mouseout", function() {
            this.setAttribute("class", "");
          });
      });
    });
  }
}
var map = new Map(20, 30);
var renderer = new Renderer("#map", map, 25);
renderer.renderMap();
