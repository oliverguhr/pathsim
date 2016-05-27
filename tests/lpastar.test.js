class LpaStarTest{
  static GetMap()
  {
    let map = new Map(6,4);

    var start = new Moveable(map, CellType.Start);
    start.moveTo(new Position(3,0));

    var goal = new Moveable(map, CellType.Goal);
    goal.moveTo(new Position(0,5));

    let setBlock = function(x,y)
    {
      map.getCell(x,y).type = CellType.Blocked;
    };

    setBlock(0,1);
    setBlock(0,2);
    setBlock(0,3);
    setBlock(0,4);

    setBlock(2,1);
    setBlock(2,2);
    setBlock(2,3);
    setBlock(2,4);

    return map;
  }

  static run()
  {
    let map = LpaStarTest.GetMap();

    LpaStarTest.injectMap(map);

    let lpastar = new LpaStar(map);    

    lpastar.run();


  }

  static injectMap(testMap)
  {
    /*brr. this is hackish. We inject our testmap into the (hopefully) running map */
    angular.element(document.getElementById("map")).scope().$apply(
      (scope) => {
        scope.map.rows = testMap.rows;
        scope.map.cols = testMap.cols;
        scope.map.initializeMap(testMap);
      });
  }
}
