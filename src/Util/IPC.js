"use strict";

const Bluebird = require('bluebird');
const ipc = require('electron').ipcMain;
const errToJSON = require('error-to-json');


module.exports = {
    on(eventName, cb) {

        ipc.on(eventName, (event, data) => {
            let prom = cb(data);
            if (!(prom instanceof Promise) && !(prom instanceof Bluebird)) {
                let _prom = new Promise((res, rej) => {
                    return res(prom);
                });
                prom = _prom;
            }

            if (!data) {
                return;
            }
            let ref = data['_ref'];
            if (!ref) {
                return;
            }
            delete data['_ref'];
            prom
                .then((responseData) => {
                    event.sender.send(ref, responseData);
                    event.sender.send(eventName, responseData);
                })
                .catch((e) => {
                    event.sender.send(ref, {error: e.message, original: errToJSON(e), _type: 'error'});
                });
        });
    }
}