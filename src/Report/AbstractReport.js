"use strict";

const Promise = require('bluebird');
const ModuleLoader = require('../Loader/ModuleLoader');
const fs = require('fs');
const Path = require('path');

/**
 * @class
 * @abstract
 */
class AbstractReport {

    /**
     * @param {Object|String} options
     * @param {Object} config
     * @param {Object} loaderConfig
     */
    constructor(options, config, loaderConfig) {
        if (typeof options === 'string') {
            options = {url: options}
        }

        let defaultOptions = Object.assign({}, {
            url: null,
            proxy: null
        }, options);

        this.url = defaultOptions.url;
        this.proxy = defaultOptions.proxy;

        this.config = config;
        this.loaderConfig = loaderConfig || [];
        this.createdAt = null;
        this.isCompleted = false;
        this.moduleLoader = new ModuleLoader();
        this.loaders = {};
    }

    /**
     * Get config for loader
     *
     * @param {String} key
     * @returns {Object}
     */
    _getConfig(key) {
        let len = this.loaderConfig.length;
        for (let i = 0; i < len; i++) {
            let loaderConf = this.loaderConfig[i];
            if (loaderConf.key === key) {
                return loaderConf;
            }
        }
        throw new Error('No config for ' + key);
        return null;
    }

    /**
     * Instanciate all required loaders
     *
     * @params {Array} enabledLoaders
     * @private
     */
    _createLoaders(enabledLoaders) {
        let p = [];
        let len = enabledLoaders.length;
        for (let i = 0; i < len; i++) {
            let loaderKey = enabledLoaders[i];
            let loaderConf = this._getConfig(loaderKey);

            p.push(this.moduleLoader.getClass(loaderKey)
                .then((Loader) => {
                    let url = this.proxy !== null ? this.proxy : this.url;
                    let loader = new Loader(url, this.config, loaderConf.config, loaderConf.budget);
                    let loaderKey = Loader.getKey();

                    if (process.env.NODE_ENV === 'dev' && fs.existsSync(jsonFile)) {
                        let jsonFile = Path.resolve(Path.join(__dirname, '../../', 'data'), loaderKey + ".json");
                        console.log('Load local data file for ', loaderKey);
                        loader.data = require(jsonFile);
                    } else {
                        loader.data = null;
                    }

                    this.loaders[loaderKey] = loader;
                })
            )
        }
        return Promise.all(p);
    }

    /**
     * Start the report
     *
     * @param {Array} enabledLoaders
     * @returns {Promise}
     */
    start(enabledLoaders) {
        return this._createLoaders(enabledLoaders)
            .then(() => {
                return this.create(enabledLoaders);
            })
    }

    /**
     * run all loaders to create a report
     *
     * @param {Array} enabledLoaders array of loader names
     */
    create(enabledLoaders) {
        throw new Error("Method not implemented");
    }

    /**
     * Transform data to json
     * @return {String}
     */
    toJson() {
        return JSON.stringify(this.loaders);
    }

    /**
     *
     * Get all loaders
     *
     * @returns {Object}
     */
    getLoaders() {
        return this.loaders;
    }

    /**
     * Get loader by key
     *
     * @param key
     * @returns {Object}
     */
    get(key) {
        return this.loaders[key];
    }

    /**
     * Set data for loader
     *
     * @param {Object} data
     */
    setLoaders(data) {
        this.loaders = data;
    }
}

module.exports = AbstractReport;
