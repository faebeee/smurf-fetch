'use strict';

const unit = require('unit.js');

const Reporter = require('../../src/Reporter');

const Config = require('../conf.json');

describe('CSSAnalyzeLoader', function () {
    beforeEach(() => {
        this.reporter = new Reporter(Config.url);
    });

    it('load data', (done) => {
        this.reporter.start(['CSSAnalyzeLoader'])
            .then((data) => {
                return this.reporter.getLoaderData('CSSAnalyzeLoader');
            })
            .then( (data) => {
                unit.object(data.data).isNot(null);
                done();
            });
    });

});