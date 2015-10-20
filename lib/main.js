/* jslint node:true */
/* jshint unused:true, eqnull:true, curly:true, eqeqeq:true, maxcomplexity:4, maxdepth:3 */

'use strict';

/*
 * Module dependencies
 */

var request = require('superagent'),
    constants = require('./constants.js'),
    prototypes = require('./prototypes.js'),
    myUtils = require('./utils.js'),
    libpackage = require('../package.json');

/*
 * Constructor
 *
 * @param {user, appkey} TotalCoin user & hash key auth
 * @return {Object} new instance
 */

function TotalCoin(user, appkey) {
    this.user = user;
    this.appkey = appkey;

    // Add metadata prototypes
    this.version = libpackage.version;
    this.description = libpackage.description;

    return this;
}

/*
 * Add constants prototype to TotalCoin
 */

for (var key in constants) {
    delete(constants[key].default);
    TotalCoin.prototype[key] = constants[key];
}

/*
 * Create enpoints prototypes
 */

prototypes(TotalCoin, function(params, endpoint, callback) {

    // Request API endpoint 
    var req = request[endpoint.method](endpoint.url)
        .accept('json')
        .set({
            'User-Agent': 'TotalCoin Client lib for Node.js (version ' + this.version + ')'
        })
        .set(endpoint.headers)
        .buffer(true)
        .type(endpoint.type || 'json');

    if (endpoint.method === 'get') {
        req.query(params);
    } else {
        req.send(params);
    }

    req.end(function(err, res) {

        // parse response
        var response = (res && res.text) ? myUtils.parseJSON(res.text) : null;

        // format errors
        var errors = myUtils.mergeErrors(err, response);

        if (typeof endpoint.transformErrors === 'function') {
            errors = endpoint.transformErrors(errors);
        }

        // transform response
        if ('function' === typeof endpoint.transformResponse) {
            response = endpoint.transformResponse(response);
        }

        //execute callback on response
        callback(errors, response);

    });
});

/*
 * Export new constructor wrapper
 */

module.exports = function(user, appkey) {
    return new TotalCoin(user, appkey);
};
