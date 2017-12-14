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
                    "checkLinks": true,
                }
            }
        ]);
        reporter.start(Config.url, ['NetsniffLoader'])
            .then((data) => {
                unit.object(data.data.NetsniffLoader.data).isNot(null)
                done();
            })
            .catch(done);

    });

    it('check valid date', (done) => {
        let reporter = new Reporter(Config.userConf, [
            {
                "key": "NetsniffLoader",
                "config": {
                    "checkLinks": true,
                }
            }
        ]);
        reporter.start(Config.url, ['NetsniffLoader'])
            .then((data) => {
                unit.object(data.data.NetsniffLoader.data).isNot(null);
                let loaderData = data.data.NetsniffLoader.data;
                unit.number(loaderData.log.entries[0].time).isNot(0);
                unit.number(loaderData.log.entries[0].timings.wait).isNot(0);
                unit.number(loaderData.log.entries[0].timings.receive).isNot(0);
                done();
            })
            .catch(done);

    });

});
