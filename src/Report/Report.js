"use strict";

const Promise = require('bluebird');
const TestDataLoader = require('../Loader/TestDataLoader');
const fs = require('fs');
const Path = require('path');


module.exports = class Report {
    /**
     *
     * @param url
     * @param config
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
     *
     * @param loaders
     * @param enabledLoaders
     * @returns {Promise.<T>}
     * @private
     */
    _processSingleLoader(loaders, enabledLoaders) {
        let loader = loaders.pop();
        loader.url = this.url;

        if (!!~enabledLoaders.indexOf(loader.getKey())) {
            loader.isLoading = true;
            return loader.load()
                .then(() => {
                    loader.isLoading = false;
                    if (loaders.length > 0) {
                        return this._processSingleLoader(loaders, enabledLoaders);
                    }
                    return null;
                })
                .catch( e => {
                    loader.errorMessage = e.message;
                    console.error(e);
                })
        }

        if (loaders.length > 0) {
            return this._processSingleLoader(loaders, enabledLoaders);
        }
        return Promise.resolve(null);

    }

    /**
     * run all loaders to create a report
     * @param {Array} loaders array of loader names
     */
    create(enabledLoaders) {
        this.isCompleted = false;
        let loaders = Object.values(this.loaders).splice(0);
        for(let i = 0; i < loaders.length; i++){
            if (!!~enabledLoaders.indexOf(loaders[i].getKey())) {
                loaders[i].isLoading = true;
            }
        }

        return this._processSingleLoader(loaders, enabledLoaders)
            .then(() => {
                this.createdAt = Date.now();
                this.isCompleted = true;
            })
            .catch((e) => {
                this.isCompleted = false;
                throw e;
            })
    }

    /**
     * Transform data to json
     */
    toJson() {
        return JSON.stringify(this.loaders);
    }

    /**
     * Get loader by key
     * @param key
     * @returns {Object}
     */
    get(key) {
        return this.loaders[key];
    }
};