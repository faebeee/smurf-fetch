'use strict';

const WebPageTest = require('webpagetest');

const AbstractLoader = require('./AbstractLoader');

/**
 * @extends {AbstractLoader}
 */
class WebPageTestLoader extends AbstractLoader {
    static getKey() {
        return 'WebPageTestLoader';
    }

    load() {
        return new Promise((res, rej) => {
            let key = this.userConfg.webPageTestApiKey;
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
}

module.exports = WebPageTestLoader;
