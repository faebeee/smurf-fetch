"use strict";

const chunk = require("chunk");
const Promise = require("bluebird");

const AbstractReport = require("./AbstractReport");


module.exports = class ChunkedReport extends AbstractReport {

    /**
     * Process single chunk element
     * @param {AbstractLoader[]} loadersChunk
     * @returns {Promise<T>}
     * @private
     */
    _processChunk(loadersChunk){
        let loaders = loadersChunk;
        let promises = [];

        for(let i = 0; i < loaders.length; i++){
            let loader = loaders[i];
            promises.push(loader.load())
        }

        return Promise.all(promises)
            .then(() => {
                return null;
            })
            .catch( e => {
                console.error(e);
            });
    }

    /**
     * Process all chunks
     * @param {Array[]} loaderChunk
     * @private
     */
    _processChunks(loaderChunk){
        let chunk = loaderChunk.pop();

        return this._processChunk(chunk)
            .then( () => {
                if(loaderChunk.length > 0){
                    return this._processChunks(loaderChunk);
                }
                return null;
            })
    }

    /**
     * run all loaders to create a report
     * @param {Array} enabledLoaders array of loader names
     * @param {Number} chunkSize
     */
    create(enabledLoaders, chunkSize) {
        chunkSize = chunkSize || 3;
        this.isCompleted = false;
        let loaders = Object.values(this.loaders).splice(0);
        let loadersToProcess = [];

        for(let i = 0; i < loaders.length; i++){
            if (!!~enabledLoaders.indexOf(loaders[i].getKey())) {
                loadersToProcess.push(loaders[i]);
            }
        }
        loadersToProcess = chunk(loadersToProcess, chunkSize);
        return this._processChunks(loadersToProcess)
            .then(() => {
                this.createdAt = Date.now();
                this.isCompleted = true;
            })
            .catch((e) => {
                this.isCompleted = false;
                throw e;
            })


    }
};