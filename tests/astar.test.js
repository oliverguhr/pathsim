function GetTestMap()
{
  let cells = Math.round(Math.sqrt(500000));

  let map = new Map(cells, cells);

  var start = new Moveable(map, CellType.Start);
  start.moveTo(new Position(Math.round(cells / 4), Math.round(cells / 2)));

  var goal = new Moveable(map, CellType.Goal);
  goal.moveTo(new Position(Math.round((cells / 4) * 3), Math.round(cells / 2)));

  let generator = new ObstacleGenerator(map);
  generator.addRandomObstacles((map.cols * map.rows) * 0.1);

  return map;
}

function AStarTest(){
  let map = GetTestMap();

  let astar = new AStar(map);

  console.time("astar euklid");
  //console.profile("astar");
  astar.run();
  //console.profileEnd("astar");
  console.timeEnd("astar euklid");

  map.resetPath();
  astar = new AStar(map);
  astar.distance = Distance.diagonalShortcut;
  console.time("astar diagonalShortcut");
  //console.profile("astar");
  astar.run();
  //console.profileEnd("astar");
  console.timeEnd("astar diagonalShortcut");
}
