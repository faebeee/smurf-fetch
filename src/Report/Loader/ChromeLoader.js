'use strict';

const reporter = require('chrome-reporter');

const AbstractLoader = require('./AbstractLoader');

/**
 * @extends {AbstractLoader}
 */
class ChromeLoader extends AbstractLoader {

    static getKey() {
        return 'ChromeLoader';
    }

    load() {
        return reporter({
            port: 9334,
            url: this.url,
            scenarios: [
                {
                    name: "3Gx6",
                    device: {
                        width: 1200,
                        height: 1200,
                        deviceScaleFactor: 1,
                        mobile: false,
                        fitWindow: false,
                    },
                    network: {
                        offline: false,
                        latency: 200, // ms
                        downloadThroughput: 780 * 1024 / 8, // 780 kb/s
                        uploadThroughput: 330 * 1024 / 8, // 330 kb/s
                    }
                },
                {
                    name: "3Gx4",
                    device: {
                        width: 1200,
                        height: 1200,
                        deviceScaleFactor: 1,
                        mobile: false,
                        fitWindow: false,
                    },
                    network: {
                        offline: false,
                        latency: 200, // ms
                        downloadThroughput: 780 * 1024 / 8, // 780 kb/s
                        uploadThroughput: 330 * 1024 / 8, // 330 kb/s
                    }
                },
                {
                    name: "4G",
                    device: {
                        width: 1200,
                        height: 1200,
                        deviceScaleFactor: 1,
                        mobile: false,
                        fitWindow: false,
                    },
                    network: {
                        offline: false,
                        latency: 200, // ms
                        downloadThroughput: 6000 * 1024 / 8, // 780 kb/s
                        uploadThroughput: 1000 * 1024 / 8, // 330 kb/s
                    }
                },
            ]
        })
            .then(data => {
                this.data = data;
            });
    }
}

module.exports = ChromeLoader;
