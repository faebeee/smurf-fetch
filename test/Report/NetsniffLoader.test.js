'use strict';

const unit = require('unit.js');
const Reporter = require('../../src/Reporter');
const Config = require('../conf.json');

describe('NetsniffLoader', function () {

    it('Create', (done) => {
        let reporter = new Reporter(Config.userConf, [
            {
                "key": "NetsniffLoader",
                "config": {
                  "checkLinks" : true,
                  "checkPages" : true
                }
              }
        ]);
        reporter.start(Config.url, ['NetsniffLoader'])
            .then( (data) => {
                unit.object(data.data.NetsniffLoader.data).isNot(null)
                done();
            })
            .catch( done );

    });

});
