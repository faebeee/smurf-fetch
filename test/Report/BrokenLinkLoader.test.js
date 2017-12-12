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
                  "checkLinks" : true,
                  "checkPages" : true
                }
              }
        ]);
        reporter.start(Config.url, ['BrokenLinkLoader'])
            .then( (data) => {
                unit.array(data.data.BrokenLinkLoader.data.pages).isNotEmpty()
                done();
            })
            .catch( done );

    });

});
