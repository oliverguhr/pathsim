import {Map, Moveable, CellType, Position} from "./index";

describe("The map", () => {
     let map: Map;

    beforeEach(function () {
        let cells = 5;

        map = new Map(cells, cells);

        let start = new Moveable(map, CellType.Start);
        start.moveTo(new Position(Math.round(cells / 4), Math.round(cells / 2)));

        let goal = new Moveable(map, CellType.Goal);
        goal.moveTo(new Position(Math.round((cells / 4) * 3), Math.round(cells / 2)));

        // let generator = new ObstacleGenerator(map);
        // generator.addRandomObstacles((map.cols * map.rows) * 0.1);        
    });


    describe("getIndexOfCell", () => {
        it("should return the correct index", () => {
            let cell = map.getCell(1,1);
            if(map.getIndexOfCell(cell) !== map.cells.indexOf(cell))
            {
                throw new Error("Index of goal cell is "+map.getIndexOfCell(cell) + " but should be " +map.cells.indexOf(cell));
            }
        });
    });
});
