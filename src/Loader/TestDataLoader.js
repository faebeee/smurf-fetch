'use stict'
const AbstractLoader = require('./AbstractLoader');

module.exports = class TestDataLoader extends AbstractLoader {

    constructor(key, url, config) {
        super(key, url, config);
        this.key = key;
        this.data = {};
    }

    static getKey(){
        return 'LightHouseLoader';
    }

    load() {
        return new Promise((res, rej) => {
            try {
                this.data = require("../../data/" + this.key + ".json");
            } catch (e) {
                throw e;
            }
            return res();
        })
    }
};