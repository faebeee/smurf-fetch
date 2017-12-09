'use strict';

const dns = require('dns');
const url = require('url');
const satelize = require('satelize');

const AbstractLoader = require('./AbstractLoader');

module.exports = class GeoIPLoader extends AbstractLoader {

    static getKey(){
        return 'GeoIPLoader';
    }

    load() {
        this.data = [];
        let host = url.parse(this.url).host;

        return new Promise((res, rej) => {
            dns.resolve(host, 'A', (err, addresses) => {
                if (err) {
                    return rej(err);
                }

                for (let i = 0; i < addresses.length; i++) {
                    satelize.satelize({ip: addresses[i]}, (err, payload) => {
                        if (err) {
                            throw err;
                        }
                        this.data.push({lat: payload.latitude, lon: payload.longitude});
                    })
                }
                return res();
            });
        })

    }
};