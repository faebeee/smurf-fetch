'use strict';

const glob = require( 'glob' );
const path = require('path');

const ROOT_PATH = '../Report/Loader';

/**
 *
 */
class ModuleLoader {
    /**
     * Get all loaderfiles
     *
     * @returns {Promise}
     * @memberof ModuleLoder
     */
    getFiles() {
        let normalizedPath = path.resolve(__dirname, ROOT_PATH);
        normalizedPath = path.join(normalizedPath, '**/*Loader.js');
        return  Promise.resolve(glob.sync(normalizedPath, { ignore:['**/AbstractLoader.js']}));
    }

    /**
     * Get single file for specific loader
     * @param {String} key
     * @returns {Promise}
     */
    getFile(key) {
        return this.getFiles()
        .then( (files) => {
            let loaders = [];
            for (let i = 0; i < files.length; i++) {
                let classFile = files[i];
                let LoaderClass = require(classFile);
                if(LoaderClass.getKey() === key){
                    return classFile
                }
            }
            return null;
        })
    }


    /**
     * Get class for loader
     * @param {String} key
     * @returns {Promise}
     */
    getClass(key){
        return this.getFile(key)
        .then( (file) => {
            if(!file){
                throw new Error('Loader '+key+' not found');
            }
            return require(file);
        })
    }


    /**
     * Get class for loader
     * @param {String} keys
     * @returns {Promise}
     */
    getAllClasses(){
        return this.getLoaderKeys()
            .then( keys => {
                return this.getClasses(keys);
            })
    }

    /**
     * Get class for loader
     * @param {String} keys
     * @returns {Promise}
     */
    getClasses(keys){
        if(keys === undefined){
            return this.getAllClasses();
        }

        let p = [];
        for(let i = 0; i < keys.length; i++){
            let key = keys[i];
            p.push(this.getClass(key));
        }
        return Promise.all(p);
    }

    /**
     * Get all keynames for loaders
     *
     * @returns {Promise}
     * @memberof ModuleLoder
     */
    getLoaderKeys(){
        return this.getFiles()
            .then( (files) => {
                if(!files || files.length === 0){
                    throw new Error('No files found');
                }
                let loaders = [];
                for (let i = 0; i < files.length; i++) {
                    let classFile = files[i];
                    let LoaderClass = require(classFile);
                    loaders.push(LoaderClass.getKey());
                }
                return loaders;
            })
    }
}

module.exports = ModuleLoader;
