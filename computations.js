var phantomas = require('phantomas');

module.exports.runTest = function runTest(url, sampleSize) {
    const url1Promise = Array.from(Array(sampleSize)).map(function(arr, index) {
        return phantomas(url, {'cache-control': 'max-age=-1', 'pragma': 'no-cache', 'expires': 0});
    });

    return new Promise(function(resolve, reject) {
        Promise.all(url1Promise).then(function(jsonArray) {
            const results = jsonArray.map(function(result) {
                return {
                    requests: result.json.metrics.requests,
                    timeToFirstByte: result.json.metrics.timeToFirstByte,
                    domContentLoaded: result.json.metrics.domContentLoaded
                }
            });
            resolve(results);
        }).catch(function(err) {
            reject(err);
        });
    });
}


module.exports.getMean = function getMean(arr, sampleSize) {
    return arr.map((a)=>a.timeToFirstByte).reduce(function(prev, current) {
        return prev + current;
    })/sampleSize;
}
