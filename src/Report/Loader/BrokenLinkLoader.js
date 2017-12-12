'use strict';

const AbstractLoader = require('./AbstractLoader');
const blc = require('broken-link-checker');


module.exports = class BrokenLinkLoader extends AbstractLoader {

    static getKey() {
        return 'BrokenLinkLoader';
    }

    load() {
        let brokenLinks = [];

        return new Promise((res, rej) => {
            var siteChecker = new blc.SiteChecker(this.config.options, {
                robots: (robots, customData) => {
                },
                html: (tree, robots, response, pageUrl, customData) => {
                },
                junk: (result, customData) => {
                },
                link: (result, customData) => {
                    if (!result.broken || this.config.checkLinks === false) {
                        return;
                    }
                    brokenLinks.push({url: result.base.original, result})
                },
                page: (error, pageUrl, customData) => {

                },
                site:  (error, siteUrl, customData) => {
                },
                end: () => {
                    this.data = {
                        links:brokenLinks,
                    };
                    res(this.data);
                }
            });

            siteChecker.enqueue(this.url);
        })
    }
};
