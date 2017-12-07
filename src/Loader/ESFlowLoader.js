'use strict';

const Promise = require('bluebird');
const esflow = require('esflow');
const ineed = require('ineed');
const request = require('request');
const fs = require('fs');

var sources = ['document.cookie', 'location.href', 'location.hash', 'window.name', 'location', 'XMLHttpRequest'];
var sinks = ['.innerHTML', '.outerHTML', '$', 'jQuery', 'eval', 'setTimeout', 'document.write', 'location'];
var filters = ['escape', 'encodeURI', 'encodeHTML', 'clean'];


const AbstractLoader = require('./AbstractLoader');

module.exports = class ESFlowLoader extends AbstractLoader {
    constructor(url, config) {
        super(url, config);
    }

    static getKey() {
        return 'ESFlowLoader';
    }

    load() {
        return this.getJsCode(this.url, true)
            .then((data) => {
                fs.writeFileSync('ESFlowLoader.json', JSON.stringify(data));
                this.data = data;
                return this.data;
            })
    }


    getJsCode(url, recurse) {
        return new Promise((res, rej) => {
            if (url.endsWith('.js')) {
                request(url, (err, response) => {
                    var jsCode = response.body.trim();
                    res(this._analyze({name: url, file: jsCode}));
                });
                return;
            }

            ineed.collect.jsCode.scripts.from(url, (err, response, result) => {
                if (err) {
                    console.log('Error connecting to ' + url);
                    console.log(err.reason);
                    return;
                }

                var jsCode = result.jsCode;
                jsCode = jsCode.join('').trim();
                //analyze([{name: url, file: jsCode}]);
                // Iterate through all scripts and analyze them one by one.
                let scriptLoaders = [];
                let codeResults = [];

                scriptLoaders.push(this._analyze({name: url, file: jsCode})
                    .then((code) => {
                        codeResults.push(code)
                    }));


                result.scripts.forEach((scriptUrl) => {
                    scriptLoaders.push(
                        this._getScript(scriptUrl)
                            .then((code) => {
                                return this._analyze(code);
                            })
                            .then(result => {
                                codeResults.push(result)
                            })
                            .catch( () => {

                            })
                    );
                });


                Promise.all(scriptLoaders)
                    .then(() => {
                        res(codeResults);
                    })
            });

        })
    }

    _analyze(code) {
        return new Promise((res, rej) => {
            return res(esflow.analyze(code.file, {sources, sinks, filters}));
        })
    }

    _getScript(url) {
        return new Promise((res, rej) => {
            request(url, (err, response) => {
                if (!err)
                    res({name: url, file: response.body});
            });
        });
    }
}
;