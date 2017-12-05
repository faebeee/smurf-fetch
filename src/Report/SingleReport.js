"use strict";

const Promise = require('bluebird');
const Report = require("./AbstractReport");

module.exports = class SingleReport extends Report{

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
     * @param {Array} enabledLoaders array of loader names
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
};