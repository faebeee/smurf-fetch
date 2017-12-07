'use strict';

const AccessSniff = require('access-sniff');
const AbstractLoader = require('./AbstractLoader');
const CONFIG = {
    options: {
        browser: true,
        accessibilityLevel: 'WCAG2AAA',
        reportType: 'json',
        verbose: false,
        force: true
    }
}

module.exports = class AccessSniffLoader extends AbstractLoader {
    constructor(url, config) {
        super(url, config);
    }

    static getKey(){
        return 'AccessSniffLoader';
    }

    load() {
        return AccessSniff
            .default([this.url], CONFIG.options)
            .then((report) => {
                return AccessSniff.report(report, {
                    reportType: 'json'
                });
            })
            .then( (data) => {
                this.data = JSON.parse(data);
                return this.data;
            })
    }
};