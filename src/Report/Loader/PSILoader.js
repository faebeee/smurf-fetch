'use strict';

const psi = require('psi');

const AbstractLoader = require('./AbstractLoader');
const localTunnel = require('../../Util/Localtunnel');
const urlParse = require('url-parse');

/**
 * @extends {AbstractLoader}
 */
class PSILoader extends AbstractLoader {

    static getKey() {
        return 'PSILoader';
    }

    load() {
        let url = urlParse(this.url);

        if (this.config.local === true) {
            return localTunnel(url.port, (tunnelUrl) => {
                console.log(tunnelUrl);
                return psi(tunnelUrl, {
                    strategy: this.config.strategy
                })
                    .then((result) => {
                        this.data = result;
                    })
            })
                .then(() => {
                    return this.data;
                })
        }

        return psi(this.url, {
            strategy: this.config.strategy
        })
            .then((result) => {
                this.data = result;
                return this.data;
            })
    }
}

module.exports = PSILoader;
