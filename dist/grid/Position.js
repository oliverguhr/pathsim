System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Position;
    return {
        setters:[],
        execute: function() {
            class Position {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                }
                toString() {
                    return "x = " + this.x + " y = " + this.y;
                }
            }
            exports_1("Position", Position);
        }
    }
});
//# sourceMappingURL=Position.js.map