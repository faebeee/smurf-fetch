'use strict';

const WebPageTest = require('webpagetest');

const AbstractLoader = require('./AbstractLoader');

module.exports = class WebPageTestLoader extends AbstractLoader {
    constructor(url, config) {
        super(url, config);
    }

    static getKey(){
        return 'WebPageTestLoader';
    }

    load() {

        return new Promise((res, rej) => {
            let key = this.config.webPageTestApiKey;
            if (!key) {
                throw new Error('API Key not set');
            }

            const wpt = new WebPageTest('www.webpagetest.org', key);
            wpt.runTest(this.url, this.config.options, (err, data) => {
                if (err) {
                    throw err;
                }
                this.data = data;
                return res(data);
            });
        });
    }
};

