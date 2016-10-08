export class TypMappedDictionary<Tkey, Tvalue>{
    private data: { [id: number]: Tvalue };
    private defaultValue: Tvalue;

    /** 
     * The mapping function tells the dictionary how to transform the 
     * key into a index value. This values must be a number.
     */
    constructor(private mapping: (x: Tkey) => number, defaultValue?: Tvalue) {
        this.data = {};
        if (defaultValue !== undefined) {
            this.defaultValue = defaultValue;
        }
    }

    /** Set or overwrite data for a given key */
    public set(key: Tkey, value: Tvalue) {
        this.data[this.mapping(key)] = value;
    }

    /** 
     * Gets the value for the given key
     * Returns undefined if there is no value for the key
     */
    public get(key: Tkey) {
        let result = this.data[this.mapping(key)];
        if (result === undefined) {
            return this.defaultValue;
        } else {
            return result;
        }
    }

    /** deletes the data for a given key */
    public delete(key: Tkey) {
        delete this.data[this.mapping(key)];
    }

    /** Get the raw dictionary */
    public get dictionary() {
        return this.data;
    }

}
