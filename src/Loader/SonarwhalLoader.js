"use strict";

const AbstractLoader = require("./AbstractLoader");

const {Sonarwhal} = require("sonarwhal");

let config = {
    "browserslist": [],
    "connector": {
        "name": "jsdom",
        "options": {
            "waitFor": 1000
        }
    },
    "formatters": [
        "json"
    ],
    "ignoredUrls": [],
    "rules": {
        "amp-validator": "error",
        "apple-touch-icons": "error",
        "axe": "error",
        "content-type": "error",
        "disown-opener": "error",
        "highest-available-document-mode": "error",
        "html-checker": "error",
        "image-optimization-cloudinary": "off",
        "manifest-app-name": "error",
        "manifest-exists": "error",
        "manifest-file-extension": "error",
        "manifest-is-valid": "error",
        "meta-charset-utf-8": "error",
        "meta-viewport": "error",
        "no-disallowed-headers": "error",
        "no-friendly-error-pages": "error",
        "no-html-only-headers": "error",
        "no-http-redirects": "error",
        "no-protocol-relative-urls": "error",
        "no-vulnerable-javascript-libraries": "error",
        "ssllabs": "off",
        "strict-transport-security": "error",
        "validate-set-cookie-header": "error",
        "x-content-type-options": "error"
    },
    "rulesTimeout": 6000
};

module.exports = class SonarwhalLoader extends AbstractLoader {
    constructor(url, config) {
        super('SonarwhalLoader', url, config);
    }

    load() {
        console.log(this.url, config)
        let whal = new Sonarwhal(config);
        return whal.executeOn(this.url)
            .then(data => {
                this.data = data;
                return whal.close()
            })
            .then( () => {
                return this.data;
            })
            .catch(console.error)
    }
};