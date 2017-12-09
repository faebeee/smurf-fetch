'use strict';

const Wappalyzer = require('wappalyzer');
const AbstractLoader = require('./AbstractLoader');


module.exports = class WappalyzerLoader extends AbstractLoader {

    static getKey(){
        return 'WappalyzerLoader';
    }

    load () {
        const wappalyzer = new Wappalyzer(this.url, this.config.options);

        return wappalyzer.analyze()
            .then(json => {
                this.data = json;
                return;
            })
    }
};