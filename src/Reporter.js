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

        let loaders = this._loadLoaders();
        this.report = new Report(this.url, loaders);
    }

    /**
     *
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
     *
     */
    getJson() {
        return JSON.stringify({
            isLoaded: this.report.isComplete,
            createdAt: this.report.createdAt,
            url: this.report.url,
            isCompleted: this.report.isCompleted,
            loaders: this.enabledLoaders,
            data : this.report.getLoaders()
        });
    }

    /**
     * crate report
     */
    start(loaders) {
        this.enabledLoaders = loaders;
        return this.report.create(loaders, 3)
            .then(() => {
                return {
                    isLoaded: this.report.isComplete,
                    createdAt: this.report.createdAt,
                    url: this.report.url,
                    loaders: this.enabledLoaders
                }
            });

        return this.getData();
    }

    /**
     *
     * @returns {[string,string,string,string,string,string,string]}
     */
    getAvailableLoaders() {
        if (!this.report) {
            return;
        }



        let loaders = [
            "CSSAnalyzeLoader",
            "CSSStatsLoader",
            "LightHouseLoader",
            "LoadTestLoader",
            "Pa11yLoader",
            "PSILoader",
            "HARLoader",
            "W3CLoader",
            "SEOLoader",
            //"WappalyzerLoader",
        ];

        if (this.config.webPageTestApiKey) {
            loaders.push('WebPageTestLoader');
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
        this.report.isComplete = json.isComplete;
        this.report.isLoaded = json.isComplete;
        this.report.createdAt = json.createdAt;
        this.report.url = json.url;
        this.report.loaders = json.loaders;

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
            loaders: this.enabledLoaders
        };
    }
};