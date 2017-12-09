'use strict';

const unit = require('unit.js');
const ModuleLoader = require('../../src/Loader/ModuleLoader');

describe('ModuleLoader', function () {
    
    it('get all loaderfiles', (done) => {
        let loader = new ModuleLoader();
        loader.getFiles()
        .then( (files) => {
            unit.array(files).isNotEmpty();            
            done();
        })
        .catch( done )
    });  
    
    it('get all keys', (done) => {
        let loader = new ModuleLoader();
        loader.getLoaderKeys()
        .then( (keys) => {
            unit.array(keys).isNotEmpty();            
            done();
        })
        .catch( done )
    });
    
    it('get single file', (done) => {
        let loader = new ModuleLoader();
        loader.getFile('PSILoader')
        .then( (file) => {
            unit.string(file).isNot(null);            
            done();
        })
        .catch( done )
    });
    
    it('get loader class', (done) => {
        let loader = new ModuleLoader();
        loader.getClass('PSILoader')
        .then( (classDef) => {
            unit.function(classDef);
            done();
        })
        .catch( done )
    });

    it('get loader classes', (done) => {
        let loader = new ModuleLoader();
        loader.getClasses(['PSILoader', 'CSSStatsLoader'])
        .then( (classDef) => {
            unit.array(classDef).hasLength(2);
            done();
        })
        .catch( done )
    });

});