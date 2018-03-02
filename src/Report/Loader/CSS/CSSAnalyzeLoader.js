'use strict';

const Analyzer = require('analyze-css');
const getCss = require('get-css');
const path = require('path');

const AbstractLoader = require('../AbstractLoader');

/**
 * @extends {AbstractLoader}
 */
class CSSAnalyzeLoader extends AbstractLoader {

    static getKey() {
        return 'CSSAnalyzeLoader';
    }

    load() {
        this.data = {};

        return getCss(this.url, this.config)
            .then((response) => {
                for (let i = 0; i < response.links.length; i++) {
                    let link = response.links[i];
                    if (!link.css) {
                        continue;
                    }
                    new Analyzer(link.css, {}, (err, results) => {
                        if (err) {
                            return Promise.reject(err);
                        }
                        results.fullUrl = link.url;
                        this.data[path.parse(link.url).name] = results;
                    });
                }
            });
    }
}

module.exports = CSSAnalyzeLoader;
