import {Cell} from '../grid/index'

export class Distance {
    public static manhattan(previousCell:Cell, currentCell:Cell) {
        return Math.abs(previousCell.position.x - currentCell.position.x)
              + Math.abs(previousCell.position.y - currentCell.position.y);
    }

    public static euklid(previousCell:Cell, currentCell:Cell) {
        let x = previousCell.position.x - currentCell.position.x;
        let y = previousCell.position.y - currentCell.position.y;
        return Math.hypot(x, y); // short form for Math.sqrt( x*x + y*y );
    }

    public static diagonalShortcut(previousCell:Cell, currentCell:Cell) {
        /* See  http://www.policyalmanac.org/games/heuristics.htm  for details*/
        let xDistance = Math.abs(previousCell.position.x - currentCell.position.x);
        let yDistance = Math.abs(previousCell.position.y - currentCell.position.y);
        if (xDistance > yDistance) {
            return 14 * yDistance + 10 * (xDistance - yDistance);
        } else {
            return 14 * xDistance + 10 * (yDistance - xDistance);
        }
    }
}
