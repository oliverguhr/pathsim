import { AStar } from "./AStar";
import {Map, Moveable, CellType, Position} from "../grid/index";
import { ObstacleGenerator } from "../tools/index";

describe("AStar", () => {
    let map: Map;

    beforeEach(function () {
        let cells = Math.round(Math.sqrt(1000));

        map = new Map(cells, cells);

        let start = new Moveable(map, CellType.Start);
        start.moveTo(new Position(Math.round(cells / 4), Math.round(cells / 2)));

        let goal = new Moveable(map, CellType.Goal);
        goal.moveTo(new Position(Math.round((cells / 4) * 3), Math.round(cells / 2)));

        // let generator = new ObstacleGenerator(map);
        // generator.addRandomObstacles((map.cols * map.rows) * 0.1);

        return map;
    });

    describe("pathfinding", () => {
        it("should be successful on a empty map", () => {
            let astar = new AStar(map);
            astar.run();
        });
    });
});
