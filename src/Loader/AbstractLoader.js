'use strict'

const ipc = require('../Util/IPC');

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

        ipc.on(this.key, (arg) => {
            return {
                data: this.data,
                config: this.config,
            };
        });

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