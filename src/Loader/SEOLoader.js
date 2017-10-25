"use stict";

const seochecker = require('seo-checker');

const AbstractLoader = require('./AbstractLoader');

module.exports = class SEOLoader extends AbstractLoader {
    constructor(url, config) {
        super('SEOLoader', url, config);
    }

    load() {
        return new Promise( (res, rej) => {
            seochecker.load(this.url, (response) => {
                if (!response) { // response will be false on error
                    return res();
                } else {
                    this.data = seochecker.meta(response);

                }
                return res();
            });
        });
    }
};