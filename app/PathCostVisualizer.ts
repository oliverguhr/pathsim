import * as _ from "lodash";
import { Map, Moveable, CellType, Cell,Position } from "./Grid/index";

export class PathCostVisualizer {
    constructor(private map:Map) {
    }

    paint() {
        var distanceMulti = 1 / _.maxBy(this.map.cells.filter(cell => cell.isVisited && Number.isFinite(cell.distance)), cell => cell.distance).distance;

        this.map.cells.filter(cell => cell.isVisited).forEach(cell => {
            cell.color = this.numberToColorHsl(1 - (cell.distance * distanceMulti), 0, 1);
        });
    }

    /**
     * Convert a number to a color using hsl, with range definition.
     * Example: if min/max are 0/1, and i is 0.75, the color is closer to green.
     * Example: if min/max are 0.5/1, and i is 0.75, the color is in the middle between red and green.
     * @param i (floating point, range 0 to 1)
     * param min (floating point, range 0 to 1, all i at and below this is red)
     * param max (floating point, range 0 to 1, all i at and above this is green)
     */
    private numberToColorHsl(i:number, min:number, max:number) {
        var ratio = i;
        if (min > 0 || max < 1) {
            if (i < min) {
                ratio = 0;
            } else if (i > max) {
                ratio = 1;
            } else {
                var range = max - min;
                ratio = (i - min) / range;
            }
        }

        // as the function expects a value between 0 and 1, and red = 0° and green = 120°
        // we convert the input to the appropriate hue value
        var hue = ratio * 1.2 / 3.60;
        //if (minMaxFactor!=1) hue /= minMaxFactor;
        //console.log(hue);

        // we convert hsl to rgb (saturation 100%, lightness 50%)
        var rgb = this.hslToRgb(hue, 1, 0.5);
        // we format to css value and return
        return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
    }
    private hue2rgb(p:number, q:number, t:number) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }
        /**
         * http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
         *
         * Converts an HSL color value to RGB. Conversion formula
         * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
         * Assumes h, s, and l are contained in the set [0, 1] and
         * returns r, g, and b in the set [0, 255].
         *
         * @param   Number  h       The hue
         * @param   Number  s       The saturation
         * @param   Number  l       The lightness
         * @return  Array           The RGB representation
    */
    private hslToRgb(h:number, s:number, l:number) {
        var r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = this.hue2rgb(p, q, h + 1 / 3);
            g = this.hue2rgb(p, q, h);
            b = this.hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
    }
}
