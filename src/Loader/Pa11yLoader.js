'use stict';

const pa11y = require('pa11y');

const AbstractLoader = require('./AbstractLoader');

module.exports = class Pa11yLoader extends AbstractLoader {
    constructor (url, config) {
        super('Pa11yLoader', url, config)
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