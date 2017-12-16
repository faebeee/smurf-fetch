'use strict';

const w3c = require('w3cjs');
const Promise = require('bluebird');

const AbstractLoader = require('../AbstractLoader');

/**
 * @extends {AbstractLoader}
 */
class W3CLoader extends AbstractLoader {

    static getKey() {
        return 'W3CLoader';
    }

    //@todo add validation for URL
    load() {
        return new Promise((res, rej) => {
            w3c.validate({
                file: this.url,
                output: 'json', // Defaults to 'json', other option includes html
                callback: (error, data) => {
                    if (error) {
                        throw error;
                    }

                    this.data = data;
                    return res(data);
                }
            });
        });
    }
}

module.exports = W3CLoader;
