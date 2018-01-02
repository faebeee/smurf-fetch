'use strict';

const cssstats = require('cssstats');
const getCss = require('get-css');
const path = require('path');

const AbstractLoader = require('../AbstractLoader');

/**
 * @extends {AbstractLoader}
 */
class CSSStatsLoader extends AbstractLoader {

    static getKey() {
        return 'CSSStatsLoader';
    }

    load() {
        this.data = {};


        return getCss(this.url, this.config)
            .then((response) => {
                for (let i = 0; i < response.links.length; i++) {
                    let link = response.links[i];
                    let stats = cssstats(link.css);
                    stats.fullUrl = link.url;
                    stats.specificityGraph = stats.selectors.getSpecificityGraph();
                    stats.specificityValues = stats.selectors.getSpecificityValues();

                    delete stats.selectors.getSpecificityGraph;
                    delete stats.selectors.getSpecificityValues;
                    delete stats.selectors.getSortedSpecificity;

                    this.data[path.parse(link.url).name] = stats;
                }
            })
    }
}

module.exports = CSSStatsLoader;
