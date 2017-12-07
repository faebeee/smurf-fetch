'use strict';
const PWMetricsPWMetrics = require('pwmetrics');
const fs = require('fs');

const lighthouse = require('lighthouse');
const chromeLauncher = require('lighthouse/chrome-launcher');

const AbstractLoader = require('./AbstractLoader');
const perfConfig = {
  onlyAudits: [
    'works-offline',
    'first-meaningful-paint',
    'speed-index-metric',
    'estimated-input-latency',
    'first-interactive',
    'consistently-interactive',
  ]
};

class LightHouseLoader extends AbstractLoader {
    constructor(url, config) {
        super(url, config);
    }

    static getKey(){
        return 'LightHouseLoader';
    }

    load() {
        return this.launchChromeAndRunLighthouse(this.url, perfConfig)
            .then(results => {
                this.data = results.audits;
            })
    }

    launchChromeAndRunLighthouse(url, flags = {}, config = null) {
        return chromeLauncher.launch()
            .then(chrome => {
                flags.port = chrome.port;
                return lighthouse(url, flags, config)
                    .then(results => chrome.kill().then(() => results))
                    .catch( (e) => {
                        chrome.kill();
                        throw e;
                    })
        });
    }
}

module.exports = LightHouseLoader;