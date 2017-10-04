'use stict';

const captureHar = require('capture-har');
const AbstractLoader = require('./AbstractLoader');

module.exports = class XHRLoader extends AbstractLoader {
    constructor(url, config) {
        super('HARLoader', url, config);
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