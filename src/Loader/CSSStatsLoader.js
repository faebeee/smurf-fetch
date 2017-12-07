'use strict';

const cssstats = require('cssstats');
const getCss = require('get-css');
const path = require('path');

const AbstractLoader = require('./AbstractLoader');

module.exports = class CSSStatsLoader extends AbstractLoader{
    constructor(url, config) {
        super(url, config);
    }

    static getKey(){
        return 'CSSStatsLoader';
    }

    load() {
        this.data = {};

        let options = {
            timeout: 15000
        };

        return getCss(this.url, options)
            .then( (response) => {
                for (let i = 0; i < response.links.length; i++) {
                    let link = response.links[i];
                        let stats = cssstats(link.css);
                        stats.fullUrl = link.url;
                        stats.specificityGraph = stats.selectors.getSpecificityGraph();
                        stats.specificityValues = stats.selectors.getSpecificityValues();
                        this.data[path.parse(link.url).name] = stats;
                }
            })
    }
};