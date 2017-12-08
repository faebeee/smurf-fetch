'use strict';

const unit = require('unit.js');

const Reporter = require('../../src/Reporter');

const Config = require('../conf.json');

describe('WappalyzerLoader', function () {
    beforeEach(() => {
        this.reporter = new Reporter(Config.url);
    });

    it('load data', (done) => {
        this.reporter.start(['WappalyzerLoader'])
            .then((data) => {
                return this.reporter.getLoaderData('WappalyzerLoader');
            })
            .then( (data) => {
                unit.object(data.data).isNot(null);
                done();
            });
    });

});