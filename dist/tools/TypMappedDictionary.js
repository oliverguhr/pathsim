System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TypMappedDictionary;
    return {
        setters:[],
        execute: function() {
            TypMappedDictionary = class TypMappedDictionary {
                constructor(mapping, defaultValue) {
                    this.mapping = mapping;
                    this.data = {};
                    if (defaultValue !== undefined) {
                        this.defaultValue = defaultValue;
                    }
                }
                set(key, value) {
                    this.data[this.mapping(key)] = value;
                }
                get(key) {
                    let result = this.data[this.mapping(key)];
                    if (result === undefined) {
                        return this.defaultValue;
                    }
                    else {
                        return result;
                    }
                }
                delete(key) {
                    delete this.data[this.mapping(key)];
                }
                get dictionary() {
                    return this.data;
                }
            };
            exports_1("TypMappedDictionary", TypMappedDictionary);
        }
    }
});
//# sourceMappingURL=TypMappedDictionary.js.map