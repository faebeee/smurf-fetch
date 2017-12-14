'use strict';

const pa11y = require('pa11y');

const AbstractLoader = require('./AbstractLoader');

module.exports = class Pa11yLoader extends AbstractLoader{
    static getKey(){
        return 'Pa11yLoader';
    }

    load(){
        return new Promise( (res, rej) => {
            var test = pa11y(this.config);

            test.run(this.url, (error, results) => {
                if(error){
                    return Promise.reject(error);
                }
                this.data = results;
                return res(this.data);
            });
        })

    }
};
