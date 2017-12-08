'use strict';

const Analyzer = require('analyze-css');
const getCss = require('get-css');
const path = require('path');

const AbstractLoader = require('./AbstractLoader');

module.exports = class AnalyzeCssLoader extends AbstractLoader{

    static getKey(){
        return 'AnalyzeCssLoader';
    }

    load() {
        this.data = {};

        return getCss(this.url, this.config)
            .then( (response) => {
                for (let i = 0; i < response.links.length; i++) {
                    let link = response.links[i];
                    new Analyzer(link.css, {},(err, results) => {
                        if(err){
                            throw err;
                        }
                        results.fullUrl = link.url;
                        this.data[path.parse(link.url).name] = results;
                    });
                }
            });
    }
};