'use strict';

const phantom = require('phantom');
const {run} = require('chrome-har-capturer');
const moment = require('moment');


const AbstractLoader = require('./AbstractLoader');

function toISOString(date) {

    return moment(date).format();

    function pad(n) {
        return n < 10 ? '0' + n : n;
    }

    function ms(n) {
        return n < 10 ? '00' + n : n < 100 ? '0' + n : n
    }

    return date.getFullYear() + '-' +
        pad(date.getMonth() + 1) + '-' +
        pad(date.getDate()) + 'T' +
        pad(date.getHours()) + ':' +
        pad(date.getMinutes()) + ':' +
        pad(date.getSeconds()) + '.' +
        ms(date.getMilliseconds()) + 'Z';
}

module.exports = class NetsniffLoader extends AbstractLoader {


    static getKey() {
        return 'NetsniffLoader';
    }

    load() {
        return new Promise((res, rej) => {
            let ev = run([this.url])

            ev.on('har', (har) => {
                console.log(har)
            })
            ev.on('done', (url, index, urls) => {
                console.log(index);
                res();

            })
        });
    }

    _runPhantom(address) {
        let resources = [];
        let startTime = null;
        let instance = null;
        return phantom.create([], {
            logLevel: 'warn',
        })
            .then(_instance => {
                instance = _instance;
                return instance.createPage()
            })
            .then(page => {
                page.on('onLoadStarted', function () {
                    startTime = new Date();
                });

                page.on("onResourceRequested", (req) => {
                    resources[req.id] = {
                        request: req,
                        startReply: null,
                        endReply: null
                    };
                });

                page.on("onResourceReceived", (res) => {
                    console.log('Receive ' + JSON.stringify(res, undefined, 4));

                    if (res.stage === 'start') {
                        resources[res.id].startReply = res;
                    }
                    if (res.stage === 'end') {
                        resources[res.id].endReply = res;
                    }
                });


                return page.invokeAsyncMethod('open', this.url)
                    .then((status) => {
                        console.log(status);

                        if (status !== 'success') {
                            console.log('FAIL to load the address');
                        }
                        var endTime = new Date();
                        let title = page.evaluate(function () {
                            return document.title || '';
                        });


                        return this._toHAR(address, title, startTime, endTime, resources);
                    })
            })
        // .then((data) => {
        //     return instance.exit()
        //         .then( () => data)
        // })
    }


    _toHAR(address, title, startTime, endTime, resources) {
        var entries = [];

        resources.forEach(function (resource) {
            var request = resource.request,
                startReply = resource.startReply,
                endReply = resource.endReply;

            if (!request || !startReply || !endReply) {
                return;
            }

            // Exclude Data URI from HAR file because
            // they aren't included in specification
            if (request.url.match(/(^data:image\/.*)/i)) {
                return;
            }

            entries.push({
                startedDateTime: toISOString(request.time),
                time: endReply.time - request.time,
                request: {
                    method: request.method,
                    url: request.url,
                    httpVersion: "HTTP/1.1",
                    cookies: [],
                    headers: request.headers,
                    queryString: [],
                    headersSize: -1,
                    bodySize: -1
                },
                response: {
                    status: endReply.status,
                    statusText: endReply.statusText,
                    httpVersion: "HTTP/1.1",
                    cookies: [],
                    headers: endReply.headers,
                    redirectURL: "",
                    headersSize: -1,
                    bodySize: startReply.bodySize,
                    content: {
                        size: startReply.bodySize,
                        mimeType: endReply.contentType
                    }
                },
                cache: {},
                timings: {
                    blocked: 0,
                    dns: -1,
                    connect: -1,
                    send: 0,
                    wait: startReply.time - request.time,
                    receive: endReply.time - startReply.time,
                    ssl: -1
                },
                pageref: address
            });
        });

        return {
            log: {
                version: '1.2',
                creator: {
                    name: "PhantomJS",
                    version: ''
                },
                pages: [{
                    startedDateTime: toISOString(startTime),
                    id: address,
                    title: title,
                    pageTimings: {
                        onLoad: endTime - startTime
                    }
                }],
                entries: entries
            }
        };
    }
}
