'use strict';

const wappalyzer = require('wappalyzer');
const AbstractLoader = require('./AbstractLoader');

module.exports = class WappalyzerLoader extends AbstractLoader {
    constructor(url, config) {
        super(url, config);
    }

    static getKey(){
        return 'WappalyzerLoader';
    }

    load () {
        return wappalyzer.analyze(this.url)
            .then(json => {
                console.log(json);
                this.data = json;
                return;
            })
    }
};