"use strict";

const Promise = require('bluebird');
const TestDataLoader = require('./Loader/TestDataLoader');
const ModuleLoader = require('../Loader/ModuleLoader');
const fs = require('fs');
const Path = require('path');

module.exports = class Report {

    /**
     * @param url
     * @param loaders
     */
    constructor(url, loaders) {
        this.url = url;
        this.loaderClasses = loaders || [];
        this.createdAt = null;
        this.isCompleted = null;
        this.moduleLoader = new ModuleLoader();

        this.loaders = {};
        this._createLoaders();
    }


    /**
     * Instanciate all required loaders
     *
     * @private
     */
    _createLoaders() {
        let p = [];
        let len = this.loaderClasses.length;
        for (let i = 0; i < len; i++) {
            let loaderConf = this.loaderClasses[i];
            p.push(this.moduleLoader.getClass(loaderConf.key)
                .then( (Loader) => {
                    let loader = new Loader(this.url, loaderConf.config);
                    let loaderKey = Loader.getKey();
        
                    if (process.env.NODE_ENV === 'dev' && fs.existsSync(jsonFile)) {
                        let jsonFile = Path.resolve(Path.join(__dirname, '../../', 'data'), loaderKey + ".json");                    
                        console.log('Load local data file for ', loaderKey);
                        loader.data = require(jsonFile);
                        this.loaders[loaderKey] = loader;
                    } else {
                        loader.data = null;
                        this.loaders[loaderKey] = loader;
                    }
                })
            )               
        }
        return Promise.all(p);
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