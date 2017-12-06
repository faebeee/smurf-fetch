'use strict';

const unit = require('unit.js');

const Reporter = require('../../src/Reporter');

const Config = require('../conf.json');

describe('SonarwhalLoader', function () {
    beforeEach(() => {
        this.reporter = new Reporter(Config.url);
    });

    it('load data', (done) => {
        this.reporter.start(['SonarwhalLoader'])
            .then((data) => {
                return this.reporter.getLoaderData('SonarwhalLoader');
            })
            .then( (data) => {
                unit.object(data).isNot(null);
                done();
            });
    });

});