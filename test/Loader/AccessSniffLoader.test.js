'use strict';

const unit = require('unit.js');

const Reporter = require('../../src/Reporter');

const Config = require('../conf.json');

describe('AccessSniffLoader', function () {
    beforeEach(() => {
        this.reporter = new Reporter(Config.url);
    });

    it('load data', (done) => {
        this.reporter.start(['AccessSniffLoader'])
            .then(() => {
                return this.reporter.getLoaderData('AccessSniffLoader');
            })
            .then( (data) => {
                unit.object(data.data).isNot(null);
                done();
            });
    });

});