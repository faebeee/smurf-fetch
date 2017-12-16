'use strict';

const psi = require('psi');

const AbstractLoader = require('./AbstractLoader');

/**
 * @extends {AbstractLoader}
 */
class PSILoader extends AbstractLoader {

    static getKey() {
        return 'PSILoader';
    }

    load() {
        return psi(this.url, {
            strategy: this.config.strategy
        })
            .then((result) => {
                this.data = result;
                return this.data;
            })
    }
}
module.exports = PSILoader;
