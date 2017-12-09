'use strict';

const unit = require('unit.js');
const Reporter = require('../../src/Reporter');
const Config = require('../conf.json');

describe('Reporter', function () {
    beforeEach(() => {
        /** @var {Reporter} reporter */
        this.reporter = new Reporter(Config.url);
    });

    it('get list of available loaders', (done) => {
        Reporter.getAvailableLoaders()
        .then( (loaderNames) => {
            unit.array(loaderNames).isNotEmpty();
            done();
        })
        .catch( done );
    
    });

    it('load data from object', (done) => {
        this.reporter.setData(require('../Data/set2.json'))
            .then( (data) => {

                unit.object(data).isNot(null);
                done();
            })
            .catch( done )

    });

    it('load invalid data from object', (done) => {
        this.reporter.setData(require('../Data/set1.json'))
            .then( (data) => {
                done( new Error('Data should be invalid') );
            })
            .catch( () => {
                done()
             });
    });

    it('create report', (done) => {
        let reporter = new Reporter(Config.url, {}, Config.loaderConf);
        reporter.start(Config.loaders)
        .then( (data) => {
            done()
        })
        .catch(done);
    });

});