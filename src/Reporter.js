'use strict';

const Path = require('path');
//const Report = require('./Report/SingleReport');
const Report = require('./Report/ChunkedReport');
const ModuleLoader = require('./Loader/ModuleLoader');
const ReportValidator = require('./Validator/ReportValidator');

module.exports = class Reporter {

    /**
     * 
     * @param {String} url 
     * @param {Object} config 
     * @param {Object} loaderConfig 
     */
    constructor(config, loaderConfig) {
        this.loaders = [];
        this.enabledLoaders = [];
        this.config = config || {};
        this.elapsedMilliseconds = 0;
        this.loaderConfig = loaderConfig || require(Path.resolve(__dirname, '../config/default.json'));
        this.report = null;
    }

    /**
     * crate report
     *
     * @param {Array} loaders
     * @param {Number} chunksize
     */
    start(url, loaders) {
        this.report = new Report(url, this.config, this.loaderConfig);
        this.enabledLoaders = loaders;
        let startTimeStamp = ~~(Date.now());
        return this.report.start(loaders)
            .then(() => {
                this.elapsedMilliseconds = (~~(Date.now()))-startTimeStamp;
                return this.getData();
            });

    }

    /**
     * Get all available keys
     * 
     * @returns {Promise}
     */
     getAvailableLoaders() {
        let loader = new ModuleLoader();        
        let configuredLoadersConfig = this.loaderConfig;
        let configuredLoaders = [];
        
        for (var i = 0; i < configuredLoadersConfig.length; i++) {
            configuredLoaders.push(configuredLoadersConfig[i].key);
        }

        return loader.getLoaderKeys()
            .then( (loaders) => {
                var results = [];
                
                for (var i = 0; i < configuredLoaders.length; i++) {
                    if (loaders.indexOf(configuredLoaders[i]) !== -1) {
                        results.push(configuredLoaders[i]);
                    }
                }
                
                return results;                
            });
    }

    /**
     *  Get data from loader
     * 
     * @param loaderName
     * @returns {Promise}
     */
    getLoaderData(loaderName) {
        return new Promise((res, rej) => {
            if(!this.report){
                throw new Error('Report not created');
            }

            let loader = this.report.get(loaderName);
            if(!loader){
                throw new Error('Loader '+loaderName+' not found');
            }

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
                this.report = new Report(json.url, json.config, json.loaderConfig);
                
                this.report.isCompleted = json.isCompleted;
                this.report.createdAt = json.createdAt;
                this.report.url = json.url;
                this.elapsedMilliseconds = json.elapsedMilliseconds;
                //this.report.loaders = json.loaders;

                this.enabledLoaders = json.loaders;
                this.report.setLoaderData(json.data);

                return this.getData();
            })
    }

    /**
     * Get data
     * @returns {Object}
     */
    getData() {
        return {
            createdAt: this.report.createdAt,
            url: this.report.url,
            isCompleted: this.report.isCompleted,
            loaders: this.enabledLoaders,
            data : this.report.getLoaders(),
            elapsedMilliseconds:  this.elapsedMilliseconds,
            loaderConfig:  this.loaderConfig,
            config: this.config
        };
    }

    /**
     * Transform data to json
     * @returns {String}
     */
    getJson() {
        return JSON.stringify(this.getData());
    }
};
