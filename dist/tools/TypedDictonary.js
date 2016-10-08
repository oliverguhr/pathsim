System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TypMappedDictionary;
    return {
        setters:[],
        execute: function() {
            TypMappedDictionary = class TypMappedDictionary {
                constructor(mapping) {
                    this.mapping = mapping;
                    this.data = {};
                }
                set(key, value) {
                    this.data[this.mapping(key)] = value;
                }
                get(key) {
                    return this.data[this.mapping(key)];
                }
            };
            exports_1("TypMappedDictionary", TypMappedDictionary);
        }
    }
});
//# sourceMappingURL=TypedDictonary.js.map