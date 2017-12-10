'use strict';

let loadtest = require('loadtest');

const AbstractLoader = require('./AbstractLoader');

module.exports = class LoadTestLoader extends AbstractLoader {

    constructor (url, userConfig, config) {
        super(url, userConfig, config);

        this.max = config.view.max;
        this.data = {
            meanLatencyMs: [],
            maxLatencyMs: [],
            totalErrors: [],
            isCompleted: false,
        }
    }

    static getKey(){
        return 'LoadTestLoader';
    }

    load () {
        let options = {
            url: this.url,

            maxRequests: this.config.report.maxRequests,
            timeout: this.config.report.timeout,
            concurrency: this.config.report.concurrency,
            requestsPerSecond: this.config.report.requestsPerSecond,

            statusCallback: (error, result, latency) => {
                if (error) {
                    this.errorMessage = error.message;
                }

                if (!this.data) {
                    this.data = {
                        meanLatencyMs: [],
                        maxLatencyMs: [],
                        totalErrors: [],
                        isCompleted: false,
                    }
                }

                if (this.data.meanLatencyMs.length > this.max) {
                    this.data.meanLatencyMs.shift()
                }
                if (this.data.maxLatencyMs.length > this.max) {
                    this.data.maxLatencyMs.shift()
                }
                if (this.data.totalErrors.length > this.max) {
                    this.data.totalErrors.shift()
                }

                this.data.meanLatencyMs.push(latency.meanLatencyMs);
                this.data.maxLatencyMs.push(latency.maxLatencyMs);
                this.data.totalErrors.push(latency.totalErrors);
            },
        };

        loadtest.loadTest(options, (error, results) => {
            if (error) {
                this.errorMessage = error.message;
            }
            this.data.isCompleted = true;
        });

        return new Promise((res, rej) => {
            res()
        })
    }
};