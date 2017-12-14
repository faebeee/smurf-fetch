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
    _processChunk(loadersChunk) {
        let loaderNames = loadersChunk;
        let promises = [];

        for (let i = 0; i < loaderNames.length; i++) {
            let loaderName = loaderNames[i];
            promises.push(
                this.loaders[loaderName].start()
                    .then(() => {
                        console.log(loaderName, 'completed');
                    })
                    .catch(console.error)
            )
        }

        return Promise.all(promises)
            .then(() => {
                return null;
            })
            .catch(e => {
                console.error(e);
            });
    }

    /**
     * Process all chunks
     * @param {Array[]} loaderChunk
     * @private
     */
    _processChunks(loaderChunk) {
        let chunk = loaderChunk.pop();

        return this._processChunk(chunk)
            .then(() => {
                if (loaderChunk.length > 0) {
                    return this._processChunks(loaderChunk);
                }
                return null;
            })
    }

    /**
     * run all loaders to create a report
     * @param {Array} enabledLoaders array of loader names
     * @returns {Promise}
     */
    create(enabledLoaders) {
        let chunkSize = this.config.chunkSize || 3;
        this.isCompleted = false;
        let loaders = Object.values(this.loaders).splice(0);
        let loadersToProcess = [];

        if (enabledLoaders.length === 0) {
            throw new Error('No loaders given');
        }

        enabledLoaders = chunk(enabledLoaders, chunkSize);
        return this._processChunks(enabledLoaders)
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
