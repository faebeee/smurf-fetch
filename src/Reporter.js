'use strict';

const Path = require('path');
//const Report = require('./Report/SingleReport');
const Report = require('./Report/ChunkedReport');


module.exports = class Reporter {
    constructor(url, config) {
        this.loaders = [];
        this.enabledLoaders = [];
        this.url = url;
        this.config = config;
        this.elapsedMilliseconds = 0;

        let loaders = this._loadLoaders();
        this.report = new Report(this.url, loaders);

    }

    /**
     * initialize all configured loaders
     */
    _loadLoaders() {
        let loaders = [];
        let loaderConf = require(Path.resolve(__dirname, '../config/loaders.json'));

        for (let i = 0; i < loaderConf.length; i++) {
            let conf = loaderConf[i];
            let config = Object.assign({}, conf.config, this.config);

            let file = Path.resolve(Path.join(__dirname, '../'), conf.file);
            loaders.push({
                class: require(file),
                config: config
            })
        }
        return loaders;
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
        return this.report.create(loaders, chunksize)
            .then(() => {
                this.elapsedMilliseconds = (~~(Date.now()))-startTimeStamp;
                return this.getData();
            });

    }

    /**
     *
     * @returns {[string,string,string,string,string,string,string]}
     */
     static getAvailableLoaders() {
        let loaderConf = require(Path.resolve(__dirname, '../config/loaders.json'));
        let loaders = [];

        for (let i = 0; i < loaderConf.length; i++) {
            let conf = loaderConf[i];
            let file = Path.resolve(Path.join(__dirname, '../'), conf.file);
            let LoaderClass = require(file);
            loaders.push(LoaderClass.getKey());
        }
        return loaders;
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
     *
     * @param {Object} json
     */
    setData(json){
        let loaderKeys = Object.keys(json.data);

        this.report = new Report(json.url, this._loadLoaders());
        this.report.isCompleted = json.isCompleted;
        this.report.isLoaded = json.isCompleted;
        this.report.createdAt = json.createdAt;
        this.report.url = json.url;
        this.elapsedMilliseconds = json.elapsedMilliseconds;
        //this.report.loaders = json.loaders;

        this.enabledLoaders = loaderKeys;
        this.report.loaders = json.data;
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
            elapsedMilliseconds:  this.elapsedMilliseconds
        };
    }

    /**
     *
     */
    getJson() {
        return JSON.stringify(this.getData());
    }
};