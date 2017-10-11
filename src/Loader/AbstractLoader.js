'use strict';

module.exports = class AbstractLoader {
    /**
     *
     * @param key
     * @param url
     * @param config
     */
    constructor(key, url, config) {
        this.url = url;
        this.config = config;
        this.key = key;
        this.data = null;
        this.isLoading = false;
        this.errorMessage = null;
    }

    getKey() {
        return this.key;
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