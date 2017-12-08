'use strict';

const Wappalyzer = require('wappalyzer');
const AbstractLoader = require('./AbstractLoader');


module.exports = class WappalyzerLoader extends AbstractLoader {
    constructor(url, config) {
        super(url, config);
    }

    static getKey(){
        return 'WappalyzerLoader';
    }

    load () {
        const wappalyzer = new Wappalyzer(this.url, this.config.options);

        return wappalyzer.analyze()
            .then(json => {
                console.log(json);
                this.data = json;
                return;
            })
    }
};