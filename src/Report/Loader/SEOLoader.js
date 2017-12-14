'use strict';

const seochecker = require('seo-checker');

const AbstractLoader = require('./AbstractLoader');

module.exports = class SEOLoader extends AbstractLoader {

    static getKey() {
        return 'SEOLoader';
    }

    load() {
        return new Promise((res, rej) => {
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
