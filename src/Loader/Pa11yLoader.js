'use strict';

const pa11y = require('pa11y');

const AbstractLoader = require('./AbstractLoader');

module.exports = class Pa11yLoader extends AbstractLoader {

    static getKey(){
        return 'Pa11yLoader';
    }

    load () {
        let test = pa11y({});
        return new Promise((res, rej) => {
            test.run(this.url, (err, results) => {
                if (err) {
                    throw err
                }
                this.data = results;
                return res()
            })
        })
    }
};