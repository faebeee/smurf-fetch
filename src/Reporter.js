'use strict';

const Path = require('path');
//const Report = require('./Report/SingleReport');
const Report = require('./Report/ChunkedReport');
const ModuleLoader = require('./Loader/ModuleLoader');
const ReportValidator = require('./Validator/ReportValidator');


module.exports = class Reporter {
    constructor(url, config, loaderConfig) {
        this.loaders = [];
        this.enabledLoaders = [];
        this.url = url;
        this.config = config || {};
        this.elapsedMilliseconds = 0;
        this.loaderConfig = loaderConfig || require(Path.resolve(__dirname, '../config/default.json'));
        this.report = new Report(this.url, this.loaderConfig);
    }

    /**
     * crate report
     *
     * @params {Array} loaders
     * @params {Number} chunksize
     */
    start(loaders, chunksize) {
        this.enabledLoaders = loaders;
        let startTimeStamp = ~~(Date.now());
        return this.report.start(loaders, chunksize)
            .then(() => {
                this.elapsedMilliseconds = (~~(Date.now()))-startTimeStamp;
                return this.getData();
            });

    }

    /**
     * Get all available keys
     * @returns {Promise}
     */
     static getAvailableLoaders() {
        let loader = new ModuleLoader();
        return loader.getLoaderKeys();
    }

    /**
     *
     * @param loaderName
     * @returns {Promise}
     */
    getLoaderData(loaderName) {
        return new Promise((res, rej) => {
            if(!this.report){
                res(null);
            }
            let loader = this.report.get(loaderName);
            res(loader);

        });
    }

    /**
     * Load report from object
     *
     * @param {Object} json
     */
    setData(json){
        let validator = new ReportValidator();
        return validator.validate(json)
            .then( () => {
                let loaderKeys = Object.keys(json.data);
                this.report = new Report(json.url);
                
                this.report.isCompleted = json.isCompleted;
                this.report.createdAt = json.createdAt;
                this.report.loaderConfig = json.loaderConfig;
                this.report.url = json.url;
                this.elapsedMilliseconds = json.elapsedMilliseconds;
                this.report.loaders = json.loaders;

                this.enabledLoaders = loaderKeys;
                this.report.data = json.data;

                return this.getData();
            })
    }

    /**
     *
     * @returns {{isLoaded: *, createdAt: *, url: *, loaders: (Array|*)}}
     */
    getData() {
        return {
            isLoaded: this.report.isComplete,
            createdAt: this.report.createdAt,
            url: this.report.url,
            isCompleted: this.report.isCompleted,
            loaders: this.enabledLoaders,
            data : this.report.getLoaders(),
            elapsedMilliseconds:  this.elapsedMilliseconds,
            loaderConfig:  this.loaderConfig
        };
    }

    /**
     *
     */
    getJson() {
        return JSON.stringify(this.getData());
    }
};
