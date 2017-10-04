'use stict'

const si = require('systeminformation')

const AbstractLoader = require('./AbstractLoader')

module.exports = class SystemInfoLoader extends AbstractLoader {

    constructor (url, config) {
        super('SystemInfoLoader', url, config)

        this.data = {
            mem: {},
            currentload: 0
        }

    }

    load () {
        return new Promise((res, rej) => {
            si.currentLoad()
                .then(data => {
                    this.data.currentload = data.currentload
                })
                .catch(error => console.error(error))

            si.mem()
                .then(data => {
                    this.data.mem = data
                })
                .catch(error => console.error(error))

            return res()
        })
    }
};