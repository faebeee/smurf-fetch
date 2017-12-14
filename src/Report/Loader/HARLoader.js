'use strict';

const captureHar = require('capture-har');
const AbstractLoader = require('./AbstractLoader');

module.exports = class HARLoader extends AbstractLoader {

    static getKey() {
        return 'HARLoader';
    }

    load() {
        return captureHar({
            url: this.url
        }, {withContent: true})
            .then(har => {
                this.data = har;
            });
    }
};
