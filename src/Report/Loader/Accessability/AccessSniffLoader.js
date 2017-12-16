'use strict';

const AccessSniff = require('access-sniff');
const AbstractLoader = require('../AbstractLoader');

/**
 * @extends {AbstractLoader}
 */
class AccessSniffLoader extends AbstractLoader {

    /**
     * @inheritDoc
     */
    static getKey() {
        return 'AccessSniffLoader';
    }

    /**
     *
     * @inheritDoc
     */
    load() {
        return AccessSniff
            .default([this.url], this.config)
            .then((report) => {
                return AccessSniff.report(report, {
                    reportType: 'json'
                });
            })
            .then((data) => {
                this.data = JSON.parse(data);
                return this.data;
            })
    }
}

module.exports = AccessSniffLoader;
