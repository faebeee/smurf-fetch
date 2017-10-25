"use stict";

const wappalyzer = require('wappalyzer');
const AbstractLoader = require('./AbstractLoader');

module.exports = class WappalyzerLoader extends AbstractLoader {

    constructor (url, config) {
        super('WappalyzerLoader', url, config)
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