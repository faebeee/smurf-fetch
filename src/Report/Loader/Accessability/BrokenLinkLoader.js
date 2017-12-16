'use strict';

const AbstractLoader = require('../AbstractLoader');
const blc = require('broken-link-checker');


class BrokenLinkLoader extends AbstractLoader {

    static getKey() {
        return 'BrokenLinkLoader';
    }

    /**
     *
     * @inheritDoc
     */
    load() {
        let brokenLinks = [];

        return new Promise((res, rej) => {
            let siteChecker = new blc.SiteChecker(this.config.options, {
                link: (result, customData) => {
                    if (!result.broken || this.config.checkLinks === false) {
                        return;
                    }
                    brokenLinks.push({url: result.base.original, result})
                },
                end: () => {
                    this.data = {
                        links: brokenLinks,
                    };
                    res(this.data);
                }
            });

            siteChecker.enqueue(this.url);
        })
    }
}

module.exports = BrokenLinkLoader;
