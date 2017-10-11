'use stict'

const w3c = require('w3cjs');
const Promise = require('bluebird');

const AbstractLoader = require('./AbstractLoader');

module.exports = class W3CLoader extends AbstractLoader {
    constructor(url, config) {
        super('W3CLoader', url, config);
    }

    load() {
        return new Promise((res, rej) => {
            w3c.validate({
                file: this.url,
                output: 'json', // Defaults to 'json', other option includes html
                callback: (error, data) => {
                    if(error){
                        throw error;
                    }

                    this.data = data;
                    return res(data);
                }
            });
        });
    }
};

