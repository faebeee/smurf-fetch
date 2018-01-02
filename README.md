smurf-fetch
===

 [![CircleCI](https://circleci.com/gh/faebeee/smurf-fetch.svg?style=svg&circle-token=e124566b18a14b88efd987dba34462c9ae970696)](https://circleci.com/gh/faebeee/smurf-fetch)


Example Config
=
[default.json](config/default.json)

Usage
=

First create a new instance of `smurf-fetch`. If you want a custom configuration, create a new one based on the example config and pass it as `CONFIG`.
Smurf fetch required 

    let smurfFetch = new SmurfFetch(SETTINGS, CONFIG);
    return smurfFetch.start(url, loaders)

Settings
==
smurf-fetch required some settings in order to work and use all given loaders. `webPageTestApiKey` is required when you want to use `webPageTest`module.
`chunkSize` defines how many loaders will be started in parallel. Depending on the machine this will require a lot of resources.

    {
        webPageTestApiKey: KEY,
        chunkSize: 3
    }

Config
==

[HARLoader](https://www.npmjs.com/package/capture-har)
===
- [requestOptions](https://www.npmjs.com/package/request#requestoptions-callback)
- harOptions

[WebPageTestLoader](https://www.npmjs.com/package/webpagetest)
===

API
==

start
===

getAvailableLoaders
===
