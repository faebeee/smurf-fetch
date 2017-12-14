'use strict';

const phantom = require('phantom');
const {run} = require('chrome-har-capturer');
const moment = require('moment');
const chromeLauncher = require('chrome-launcher');
const HeadlessChrome = require('simple-headless-chrome')


const AbstractLoader = require('./AbstractLoader');

module.exports = class NetsniffLoader extends AbstractLoader {


    static getKey() {
        return 'NetsniffLoader';
    }

    load() {
        const browser = new HeadlessChrome({
            headless: true,
            launchChrome: true,
            chrome: {
                host: 'localhost',
                port: 9222, // Chrome Docker default port
                remote: false,
                disableGPU: false,
            },
            deviceMetrics: {
                width: 1024,
                height: 768,
                deviceScaleFactor: 1,
                mobile: false,
                fitWindow: false
            },
            browserlog: true
        });
        return browser.init()
            .then(() => {
                return browser.newTab({
                    privateTab: false
                })
            })
            .then((tab) => {
                return tab.goTo(this.url)
            })
            .then(() => {
                return this._runHarCapture();
            })
            .then((data) => {
                return browser.close()
                    .then(() => data)
            })
    }


    _runHarCapture() {
        return new Promise((res, rej) => {
            let ev = run([this.url], this.config);
            ev.on('fail', (url, err, index, urls) => {
                console.log(err);
            });
            ev.on('har', (har) => {
                this.data = har;
                res(har);
            })
        })
    }
}
