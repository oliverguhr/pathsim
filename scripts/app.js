/*jshint esversion: 6 */
var app = angular.module('pathsim', []);


/* Change map from regular js
angular.element($0).scope().$apply((scope) => {scope.map.map[0][0].isBlocked = scope.map.map[0][0].isBlocked!})
*/


app.controller('MapController', function($attrs) {
  var map = this;
  map.name = "test";

  var data = new Map($attrs.rows, $attrs.cols);
  data.setStart($attrs.rows/2,Math.round($attrs.cols / 4));
  data.setGoal($attrs.rows/2,Math.round(($attrs.cols / 4)*3));

  map.cellSize = 25;
  map.widthPx = data.cols * map.cellSize;
  map.heightPx = data.rows * map.cellSize;

  map.map = data.grid;

  map.addRandomObstacles = () => {
    data.addRandomObstacles((data.cols*data.rows)*0.1);
  };
});
