'use stict'

const WebPageTest = require('webpagetest');

const AbstractLoader = require('./AbstractLoader');

module.exports = class WebPageTestLoader extends AbstractLoader {
    constructor(url, config) {
        super('WebPageTestLoader', url, config);
    }

    load() {

        return new Promise((res, rej) => {
            let key = this.config.apiKey;
            if (!key) {
                throw new Error('API Key not set');
            }

            const wpt = new WebPageTest('www.webpagetest.org', key);
            wpt.runTest(this.url, {
                pollResults: 5, timeout: 120
            }, (err, data) => {
                if (err) {
                    console.error(err);
                    return rej(err)
                }
                this.data = data;
                return res(data);
            });
        });
    }
};

