"use stict";
const analyzer = require('analyze-css');
const getCss = require('get-css');
const path = require('path');

const AbstractLoader = require('./AbstractLoader');


module.exports = class AnalyzeCssLoader extends AbstractLoader{

    constructor (url, config){
        super ('CSSAnalyzeLoader', url, config)
    }

    load() {
        this.data = {};

        var options = {
            timeout: 15000
        };

        return getCss(this.url, options)
            .then( (response) => {
                for (let i = 0; i < response.links.length; i++) {
                    let link = response.links[i];
                    new analyzer(link.css, {},(err, results) => {
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