export class Position {
    /** Column */
    public x: number;
    /** Row */
    public y: number;

    constructor(x: number , y: number ) {
        this.x = x;
        this.y = y;
    }
    
    public toString() {
        return "x = " + this.x + " y = " + this.y;
    }
}
