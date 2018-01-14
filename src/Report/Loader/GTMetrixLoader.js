'use strict';

const gtmetrix = require('gtmetrix');

const AbstractLoader = require('./AbstractLoader');

/**
 * @extends {AbstractLoader}
 */
class GTMetrixLoader extends AbstractLoader {

    static getKey() {
        return 'GTMetrixLoader';
    }

    load() {
        this.gtmetrix = gtmetrix({
            email: this.userConfg.email,
            apikey: this.userConfg.apikey,
        });

        // Run test from London with Google Chrome
        const config= {
            url: this.url,
            location: this.config.location,
            browser: this.config.browser
        };

        return this._createTest(config);

    }

    _createTest(config) {
        return new Promise( (res, rej) => {
            this.gtmetrix.test.create(config, (result) => {

                this._getTestData(result.test_id)
                    .then( (data) => {
                        res(data);
                    })
            });
        })
    }

    _getTestData(key){
        return new Promise((res, rej) => {
            this.gtmetrix.test.get(key, 5000, (err, data) => {
                if (err) {
                    return rej(err);
                }

                fs.writeFile(__dirname + '/data.json', data, console.log);
                return res(data);
            });
        })
    }
}

module.exports = GTMetrixLoader;
