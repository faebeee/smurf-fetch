"use strict";

const Promise = require('bluebird');
const TestDataLoader = require('../Loader/TestDataLoader');
const fs = require('fs');
const Path = require('path');

module.exports = class Report {

    /**
     * @param url
     * @param loaders
     */
    constructor(url, loaders) {
        this.url = url;
        this.loaderClasses = loaders;
        this.createdAt = null;
        this.isCompleted = null;

        this.loaders = {};
        this._createLoaders();
    }


    /**
     * Instanciate all required loaders
     *
     * @private
     */
    _createLoaders() {
        let promises = [];
        let len = this.loaderClasses.length;
        for (let i = 0; i < len; i++) {
            let loaderConf = this.loaderClasses[i];
            let Loader = loaderConf.class;
            let loader = new Loader(this.url, loaderConf.config);

            let jsonFile = Path.resolve(Path.join(__dirname, '../../', 'data'), loader.getKey() + ".json");

            if (process.env.NODE_ENV === 'dev' && fs.existsSync(jsonFile)) {
                console.log('Load local data file for ', loader.getKey());
                let testLoader = new TestDataLoader(loader.getKey(), this.url, loaderConf.config);
                this.loaders[testLoader.getKey()] = testLoader;
            } else {
                loader.data = null;
                this.loaders[loader.getKey()] = loader;
            }
        }
    }

    /**
     * run all loaders to create a report
     * @param {Array} enabledLoaders array of loader names
     */
    create(enabledLoaders) {
        throw new Error("Method not implemented");
    }

    /**
     * Transform data to json
     */
    toJson() {
        return JSON.stringify(this.loaders);
    }

    /**
     *
     * @returns {{}|*}
     */
    getLoaders(){
        return this.loaders;
    }

    /**
     * Get loader by key
     * @param key
     * @returns {Object}
     */
    get(key) {
        return this.loaders[key];
    }

    /**
     *
     * @param {String} loader
     * @param {Object} data
     */
    setLoaderData (data){
        this.loaders = data;
    }
};