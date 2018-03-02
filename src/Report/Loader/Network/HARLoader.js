'use strict';

const captureHar = require('capture-har');
const AbstractLoader = require('../AbstractLoader');

/**
 * @extends {AbstractLoader}
 */
class HARLoader extends AbstractLoader {

    static getKey() {
        return 'HARLoader';
    }

    load() {
        let requestOptions = this.config.requestOptions || {};
        let harOptions = this.config.harOptions || {};

        requestOptions.url = this.url;

        return captureHar(requestOptions, harOptions)
            .then(har => {
                this.data = har;
                return true;
            })
            .catch( e => {
                console.error(e);
            })
    }
}

module.exports = HARLoader;
