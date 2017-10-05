'use stict';

const PWMetrics = require('pwmetrics');

const lighthouse = require('lighthouse');
const chromeLauncher = require('lighthouse/chrome-launcher');

const AbstractLoader = require('./AbstractLoader');
const perfConfig = require('lighthouse/lighthouse-core/config/perf.json');
const fs = require('fs');

module.exports = class LightHouseLoader extends AbstractLoader {
    constructor(url, config) {
        super('LightHouseLoader', url, config)
    }

    load() {

        return this.launchChromeAndRunLighthouse(this.url, {})
            .then(results => {
                // fs.writeFileSync('lh.json', JSON.stringify(results));
                this.data = results.audits;
            })
            .catch( (e) => {
                console.error(e);
            });

        const options = {
            flags: {
                runs: '1', // number or runs
                submit: false, // turn on submitting to Google Sheets
                upload: false, // turn on uploading to Google Drive
                view: false, // open uploaded traces to Google Drive in DevTools
                expectations: false, // turn on assertation metrics results against provides values
                chromeFlags: [
                    '--headless' // run in headless Chrome
                ]
            }
        };

        const pwMetrics = new PWMetrics(this.url, options); // _All available configuration options_ can be used as `options`
        return pwMetrics.start()
            .then((data) => {
                this.data = data;
            });
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
};