'use strict';

const unit = require('unit.js');
const Reporter = require('../../src/Reporter');
const Config = require('../conf.json');

describe('BrokenLinkLoader', function () {

    it('Create', (done) => {
        let reporter = new Reporter(Config.userConf, [
            {
                "key": "BrokenLinkLoader",
                "config": {
                    "checkLinks": true,
                }
            }
        ]);

        reporter.start(Config.url, ['BrokenLinkLoader'])
            .then((data) => {
                unit.array(data.data.BrokenLinkLoader.data.links).isNotEmpty();
                done();
            })
            .catch(done);

    });

});
