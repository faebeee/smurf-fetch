'use strict';

const unit = require('unit.js');

const Reporter = require('../../src/Reporter');

const Config = require('../conf.json');

describe('ESFlowLoader', function () {
    beforeEach(() => {
        this.reporter = new Reporter(Config.url);
    });

    it('load data', (done) => {
        this.reporter.start(['ESFlowLoader'])
            .then(() => {
                return this.reporter.getLoaderData('ESFlowLoader');
            })
            .then( (data) => {
                console.log(data);
                unit.object(data.data).isNot(null);
                done();
            });
    });

});