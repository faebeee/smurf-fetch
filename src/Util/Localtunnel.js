'use strict';

const localtunnel = require('localtunnel');

/**
 *
 * @param port
 * @return {Promise<any>}
 */
function open(port) {
    return new Promise((res, rej) => {
        localtunnel(port, (err, tunnel) => {
            if (err) {
                console.error(err.message);
                return rej(err);
            }
            return res(tunnel)
        });
    })
}

/**
 *
 * @param port
 * @param cb
 */
module.exports = function (port, cb) {
    let tunnel = null;

    return new Promise((res, rej) => {
        open(port)
            .then((_tunnel) => {
                tunnel = _tunnel;
                tunnel.on('close', () => {
                    return res();
                });
                return cb(tunnel.url);
            })
            .then(() => {
                return tunnel.close();
            });
    })
};
