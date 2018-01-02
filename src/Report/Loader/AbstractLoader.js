'use strict';

/**
 * @abstract
 */
class AbstractLoader {

    /**
     *
     * @param {String} url
     * @param {Object} userConf
     * @param {Object} config
     * @param {Object} budget
     */
    constructor(url, userConf, config, budget) {
        this.url = url;
        this.config = config;
        this.userConfg = userConf;
        this.data = null;
        this.budget = budget;
        this.key = this.constructor.getKey();
        this.isLoading = false;
        this.errorMessage = null;
        this.error = null;
    }

    /**
     * Get key for loader
     *
     * @returns{String}
     */
    static getKey() {
        throw new Error('Method not implemented')
    }

    /**
     * start the loader
     *
     * @returns {Promise}
     */
    start() {
        this.isLoading = true;
        let promise = this.load();
        const isPromise = typeof promise.then === 'function';
        if (!isPromise) {
            throw new Error('load() is not returning a promise');
        }

        return promise
            .then(() => {
                this.isLoading = false;
            })
            .catch((e) => {
                this.error = e;
                throw e;
            })
    }

    /**
     * execute the loader
     *
     * @returns {Promise}
     */
    load() {
        throw new Error('Method not implemented')
    }

    /**
     * Get data
     *
     * @returns {Object}
     */
    getData() {
        return this.data
    }

    getBudget(){
        return this.budget;
    }
}

module.exports = AbstractLoader;
