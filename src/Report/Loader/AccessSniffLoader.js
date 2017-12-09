'use strict';

const AccessSniff = require('access-sniff');
const AbstractLoader = require('./AbstractLoader');


module.exports = class AccessSniffLoader extends AbstractLoader {

    static getKey(){
        return 'AccessSniffLoader';
    }

    load() {
        return AccessSniff
            .default([this.url], this.config)
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