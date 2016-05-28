class Robot {
    constructor(map) {
        this.currentDistance = 0;
        this.robot = new Moveable(map.map, CellType.Current);
        this.robot.moveTo( map.getStartCell().position);
    }

    step()
    {
        let nextCell = _.minBy(map.cells.filter(cell => cell.isCurrent && cell.distance > this.currentDistance ),cell => cell.distance);

        if(nextCell === undefined)
        {
          return;
        }
        this.robot.moveTo(nextCell);
        this.currentDistance = nextCell.distance;
    }
  }
