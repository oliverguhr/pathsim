"use strict";
class Distance {
    static manhattan(previousCell, currentCell) {
        return Math.abs(previousCell.position.x - currentCell.position.x)
            + Math.abs(previousCell.position.y - currentCell.position.y);
    }
    static euklid(previousCell, currentCell) {
        let x = previousCell.position.x - currentCell.position.x;
        let y = previousCell.position.y - currentCell.position.y;
        return Math.hypot(x, y);
    }
    static diagonalShortcut(previousCell, currentCell) {
        let xDistance = Math.abs(previousCell.position.x - currentCell.position.x);
        let yDistance = Math.abs(previousCell.position.y - currentCell.position.y);
        if (xDistance > yDistance) {
            return 14 * yDistance + 10 * (xDistance - yDistance);
        }
        else {
            return 14 * xDistance + 10 * (yDistance - xDistance);
        }
    }
}
exports.Distance = Distance;
//# sourceMappingURL=Distance.js.map