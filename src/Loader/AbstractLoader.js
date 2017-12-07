'use strict';

module.exports = class AbstractLoader {
    /**
     *
     * @param key
     * @param url
     * @param config
     */
    constructor(url, config) {
        this.url = url;
        this.config = config;
        this.data = null;
        this.key = this.constructor.getKey();
        this.isLoading = false;
        this.errorMessage = null;
    }

    static getKey() {
        throw new Error('Method not implemented')
    }

    /**
     *
     */
    load() {
        throw new Error('Method not implemented')
    }

    /**
     *
     * @returns {{}|*}
     */
    getData() {
        return this.data
    }
}