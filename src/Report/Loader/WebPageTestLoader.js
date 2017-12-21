'use strict';

const WebPageTest = require('webpagetest');
const urlParse = require('url-parse');

const AbstractLoader = require('./AbstractLoader');
const localTunnel = require('../../Util/Localtunnel');

/**
 * @extends {AbstractLoader}
 */
class WebPageTestLoader extends AbstractLoader {
    static getKey() {
        return 'WebPageTestLoader';
    }

    load() {
        let url = urlParse(this.url);

        if (this.config.local === true) {
            return localTunnel(url.port, (tunnelUrl) => {
                return new Promise((res, rej) => {
                    let key = this.userConfg.webPageTestApiKey;
                    if (!key) {
                        throw new Error('API Key not set');
                    }

                    console.log(tunnelUrl);

                    const wpt = new WebPageTest('www.webpagetest.org', key);
                    wpt.runTest(tunnelUrl, this.config.options, (err, data) => {
                        if (err) {
                            throw err;
                        }
                        this.data = data;
                        return res(data);
                    });
                });
            })
        }

        return this._runTest(this.url);


    }

    _runTest(url) {
        return new Promise((res, rej) => {
            let key = this.userConfg.webPageTestApiKey;
            if (!key) {
                throw new Error('API Key not set');
            }

            const wpt = new WebPageTest('www.webpagetest.org', key);
            wpt.runTest(url, this.config.options, (err, data) => {
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
