'use stict'
const AbstractLoader = require('./AbstractLoader');

module.exports = class AnalyzeCssLoader extends AbstractLoader {

    constructor(key, url, config) {
        super(key, url, config);
        this.key = key;
        this.data = {};
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