'use strict';

const phantom = require('phantom');
const {run} = require('chrome-har-capturer');
const moment = require('moment');
const har = require('phantomhar');
const HeadlessChrome = require('simple-headless-chrome');

const FORMAT = 'X';
let Nightmare = require('nightmare')
let harPlugin = require('nightmare-har-plugin')

harPlugin.install(Nightmare)

const AbstractLoader = require('./AbstractLoader');

module.exports = class NetsniffLoader extends AbstractLoader {


    static getKey() {
        return 'NetsniffLoader';
    }

    load() {

        let browser = new HeadlessChrome({
            headless: true,
            launchChrome: false,
            chrome: {
                host: 'localhost',
                port: 9222, // Chrome Docker default port
                remote: true,
            },
            browserlog: true
        });


        return new Promise(async (res, rej) => {
            await browser.init();
            return res();
        })
            .then(() => {

                return new Promise((res, rej) => {
                    let ev = run([this.url], this.config);
                    ev.on('fail', (url, err, index, urls) => {
                        console.log(err);
                    });
                    ev.on('har', (har) => {
                        console.log(har);
                        this.data = har;
                        res(har);
                    })
                })
            })
            .then(() => {
                browser.close();
            })
    }

    _runPhantom(address, config) {
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
                    if (res.stage === 'start') {
                        resources[res.id].startReply = res;
                    }
                    if (res.stage === 'end') {
                        resources[res.id].endReply = res;
                    }
                });


                return page.invokeAsyncMethod('open', this.url,
                    {
                        headers: {
                            'Cache-Control': 'no-cache',
                            'Pragma': 'no-cache'
                        },
                    })
                    .then((status) => {
                        if (status !== 'success') {
                            console.log('FAIL to load the address');
                        }
                        var endTime = new Date();
                        let title = page.evaluate(function () {
                            return document.title || '';
                        });


                        return new Promise((res, rej) => {
                            setTimeout(() => {
                                return res(this._toHAR(title, startTime, endTime, resources));
                            }, config.delay)
                        })


                    })
            })
    }


    _toHAR(title, startTime, endTime, resources) {
        return {
            log: {
                version: '1.2',
                creator: {
                    name: "PhantomJS",
                    version: ''
                },
                pages: [{
                    startedDateTime: moment(startTime).format(),
                    id: this.url,
                    title: title,
                    pageTimings: {
                        onLoad: endTime - startTime
                    }
                }],
                entries: this.buildEntries(resources)
            }
        };
    }

    buildEntries(resources) {
        var entries = [];
        let len = resources.length;

        for (let i = 0; i < len; i++) {
            let res = resources[i];

            if (!res) {
                continue;
            }

            let entry = this.handleResource(res);
            if (entry) {
                entries.push(entry);
            }
        }
        return entries;
    }

    handleResource(resource) {
        var request = resource.request;
        var startReply = resource.startReply;
        var endReply = resource.endReply;
        var error = resource.error;

        if (!request || !startReply || !endReply) {
            return;
        }

        /*
                var resType = types[request.url];
                if (!resType && endReply.contentType &&
                    typeof endReply.contentType === 'string') {
                    resType = this.getType(endReply.contentType, request.url);
                }*/

        if (typeof request.time === 'string') {
            request.time = new Date(request.time);
        }
        if (error) {
            startReply.bodySize = 0;
            startReply.time = 0;
            endReply.time = 0;
            endReply.content = {};
            endReply.contentType = null;
            endReply.headers = [];
            endReply.statusText = this.getErrorString(error);
            endReply.status = null;
            //resType = null;
        }


        /* Exclude Data URI from HAR file because
        // they aren't included in specification
        if (request.url.match(/(^data:image\/.*)/i)) {
            return;
        }
        */

        /* return{
           cache: {},
           pageref: this.url,
           request: {
               // Accurate `bodySize` blocked on https://github.com/ariya/phantomjs/pull/11484
               // bodySize: -1,
               bodySize: startReply.bodySize,
               cookies: [],
               headers: request.headers,
               // Accurate `headersSize` blocked on https://github.com/ariya/phantomjs/pull/11484
               // headersSize: -1,
               headersSize: 0,
               httpVersion: 'HTTP/1.1',
               method: request.method,
               queryString: [],
               url: request.url
           }
           ,
           response: {
               // Accurate `bodySize` (after gzip/deflate) blocked on https://github.com/ariya/phantomjs/issues/10156
               // bodySize: -1,
               bodySize: endReply.bodySize,
               cookies: [],
               headers: endReply.headers,
               headersSize: -1,
               httpVersion: 'HTTP/1.1',
               redirectURL: '',
               status: endReply.status,
               statusText: endReply.statusText,
               content: {
                   //_type: resType,
                   mimeType: endReply.contentType,
                   size: endReply.bodySize,
                   // This will be empty because of this PhantomJS bug: https://github.com/ariya/phantomjs/pull/11484
                   // Fortunately, in `processResponses` we have a workaround :)
                   text: endReply.body
               }
           }
           ,
           startedDateTime: moment(request.time).format(),
           time: endReply.time - request.time,
           timings: {
               blocked: 0,
               dns: -1,
               connect: -1,
               send: 0,
               wait: startReply.time - request.time,
               receive: endReply.time - startReply.time,
               ssl: -1
           }
       };*/
        return {
            startedDateTime: moment(request.time).format(),
            time: endReply.time - request.time,
            request: {
                method: request.method,
                url: request.url,
                httpVersion: "HTTP/1.1",
                cookies: [],
                headers: request.headers,
                queryString: [],
                headersSize: -1,
                bodySize: startReply.bodySize
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
                    text: endReply.body,
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
            pageref: this.url
        };
    }

    getErrorString(error) {
        // According to http://qt-project.org/doc/qt-4.8/qnetworkreply.html
        switch (error.errorCode) {
            case 1:
                return '(refused)';
            case 2:
                return '(closed)';
            case 3:
                return '(host not found)';
            case 4:
                return '(timeout)';
            case 5:
                return '(canceled)';
            case 6:
                return '(ssl failure)';
            case 7:
                return '(net failure)';
            default:
                return '(unknown error)';
        }
    }

    getType(ct, url) {
        ct = ct.toLowerCase();
        if (ct.substr(0, 8) === 'text/css') {
            return 'css';
        }
        if (/javascript/.test(ct)) {
            return 'js';
        }
        if (/\/json/.test(ct)) {
            return 'json';
        }
        if (/flash/.test(ct)) {
            return 'flash';
        }
        if (ct.substr(0, 6) === 'image/') {
            return 'cssimage';
        }
        if (ct.substr(0, 6) === 'audio/') {
            return 'audio';
        }
        if (ct.substr(0, 6) === 'video/') {
            return 'video';
        }
        if (/(\/|-)font-/.test(ct) || /\/font/.test(ct) ||
            ct.substr(0, 5) === 'font/' ||
            /\.((eot)|(otf)|(ttf)|(woff))($|\?)/i.test(url)) {
            return 'font';
        }
        if (/\.((gif)|(png)|(jpe)|(jpeg)|(jpg)|(tiff))($|\?)/i.test(url)) {
            return 'cssimage';
        }
        if (/\.((flac)|(ogg)|(opus)|(mp3)|(wav)|(weba))($|\?)/i.test(url)) {
            return 'audio';
        }
        if (/\.((mp4)|(webm))($|\?)/i.test(url)) {
            return 'video';
        }
        if (ct.substr(0, 9) === 'text/html' ||
            ct.substr(0, 10) === 'text/plain') {
            return 'doc';
        }
        return null;
    }
    ;
}
