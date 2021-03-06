import { GAAStar } from "./GAAStar";
import { Map, Moveable, CellType, Position } from "../grid/index";
import { ObstacleGenerator } from "../tools/index";

function createMap(size: number) {
    let map = new Map(size, size);

    let start = new Moveable(map, CellType.Start);
    start.moveTo(new Position(2, 2));

    let goal = new Moveable(map, CellType.Goal);
    goal.moveTo(new Position(size - 3, size - 3));

    return map;
};

describe("GAAStar", () => {
    let map: Map;

    beforeEach(function () {
        map = createMap(40);
    });

    function randomBlocksTest(blockedCellPercenatge: number) {
        let algorithm = new GAAStar(map, 300);
        (new ObstacleGenerator(map)).addRandomObstacles((map.cols * map.rows) * blockedCellPercenatge);

        algorithm.run();
    }

    describe("pathfinding", () => {
        it("should be successful on a empty map", () => {
            let algorithm = new GAAStar(map, 300);
            algorithm.run();
        });

        it("should be successful on a 10% random map", () => { randomBlocksTest(0.1) });
        it("should be successful on a 20% random map", () => { randomBlocksTest(0.2) });
        it("should be successful on a 30% random map", () => { randomBlocksTest(0.3) });
    });
});
