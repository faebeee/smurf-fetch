'use strict';

const psi = require('psi');

const AbstractLoader = require('./AbstractLoader');

module.exports = class PSILoader extends AbstractLoader {
    constructor(){
        super();
    }
    static getKey(){
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
};