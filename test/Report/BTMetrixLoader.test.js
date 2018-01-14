'use strict';

const unit = require('unit.js');
const Reporter = require('../../src/Reporter');
const Config = require('../conf.json');
require('dotenv').config();

describe('BrokenLinkLoader', function () {

    it('Create', (done) => {
        const config = Object.assign({}, Config.userConf, {
            GTMETRIX_MAIL: process.env.GTMETRIX_MAIL,
            GTMETRIX_KEY: process.env.GTMETRIX_KEY,
        });

        let reporter = new Reporter(config, [
            {
                "key": "GTMetrixLoader",
                "config": {
                    "location": 2,
                    "browser": 3
                }
            }
        ]);

        reporter.start(Config.url, ['GTMetrixLoader'])
            .then((data) => {
                unit.array(data.data.GTMetrixLoader.data).isNotEmpty();
                done();
            })
            .catch(done);

    });

});
