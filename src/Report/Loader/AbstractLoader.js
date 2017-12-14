'use strict';

module.exports = class AbstractLoader {
    /**
     *
     * @param key
     * @param url
     * @param config
     */
    constructor(url, userConf, config) {
        this.url = url;
        this.config = config;
        this.userConfg = userConf;
        this.data = null;
        this.key = this.constructor.getKey();
        this.isLoading = false;
        this.errorMessage = null;
        this.error = null;
    }

    /**
     * Get key for loader
     *
     * @returns {String}
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
        var isPromise = typeof promise.then == 'function';
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
     * @returns {{}|*}
     */
    getData() {
        return this.data
    }
}
