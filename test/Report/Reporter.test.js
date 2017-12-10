'use strict';

const unit = require('unit.js');
const Reporter = require('../../src/Reporter');
const Config = require('../conf.json');

describe('Reporter', function () {
    
    it('get list of available loaders', (done) => {
        let reporter = new Reporter(Config.userConf, Config.loaderConf);
            reporter.getAvailableLoaders()
            .then( (loaderNames) => {
                unit.array(loaderNames).isNotEmpty();
                unit.array(loaderNames).hasLength(5);
                done();
            })
            .catch( done );
    
    });

    it('load data from object', (done) => {
        let reporter = new Reporter(Config.userConf, Config.loaderConf);
        reporter.setData(require('../Data/set2.json'))
            .then( (data) => {
                unit.object(data).isNot(null);
                done();
            })
            .catch( done )
    });

    it('load invalid data from object', (done) => {
        let reporter = new Reporter(Config.userConf, Config.loaderConf);
        reporter.setData(require('../Data/set1.json'))
            .then( (data) => {
                done( new Error('Data should be invalid') );
            })
            .catch( () => {
                done()
             });
    });

    it('get data', (done) => {
        let reporter = new Reporter(Config.userConf, Config.loaderConf);
        reporter.start(Config.url, Config.loaders)
        .then( () => {
            let data = reporter.getData();
            unit.object(data).isNot(null);
            done()
        })
        .catch(done);
    });

    it('set data', (done) => {
        let reporter = new Reporter(Config.userConf, Config.loaderConf);
        reporter.start(Config.url, Config.loaders)
        .then( () => {
            let data = reporter.getData();
            unit.object(data).isNot(null);
            data.data = {};
            return reporter.setData(data);
        })
        .then( () => {
            done()
        })
        .catch(done);
    });

    it('create report', (done) => {
        let reporter = new Reporter(Config.userConf, Config.loaderConf);
        reporter.start(Config.url, Config.loaders)
        .then( (data) => {
            done()
        })
        .catch(done);
    });
});