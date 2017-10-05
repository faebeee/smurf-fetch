"use strict";

const Promise = require('bluebird');
const TestDataLoader = require('../Loader/TestDataLoader');
const Logger = require('../Logger/Log');
const fs = require('fs');
const Path = require('path');
const {webContents} = require('electron');


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
        this.isCompleted = false;

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
     * run all loaders to create a report
     * @param {Array} loaders array of loader names
     */
    create(loaders) {
        let promises = [];

        let keys = Object.keys(this.loaders);
        for (let i = 0; i < keys.length; i++) {
            let loader = this.loaders[keys[i]];
            loader.url = this.url;
            if (!!~loaders.indexOf(loader.getKey())) {
                promises.push(
                    loader.load()
                        .catch( (e) => {
                            console.error(e);
                        })
                );
            }
        }

        return Promise.all(promises)
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