/* jslint node:true */
/* jshint unused:true, eqnull:true, curly:true, eqeqeq:true, maxcomplexity:4, maxdepth:3 */

'use strict';

var endpoints = require('./endpoints.js'),
    util = require('util');

/*
 * Preprocess params
 */

var preProcess = function(obj) {
    for (var i in obj) {
        if (util.isArray(obj[i])) {
            obj[i] = obj[i].join(',');
        }
    }
};

/*
 * Create enpoints prototypes
 */

module.exports = function(root, fnct) {
    Object.keys(endpoints).forEach(function(key) {
        root.prototype[key] = function(params, callback) {
            // select endpoint object
            var endpoint = endpoints[key](this);

            // adapt to call without params
            if ('function' === typeof params) {
                callback = params;
                params = {};
            } else {
                preProcess(params);
            }

            // transform endpoint params
            if ('function' === typeof endpoint.transformParams) {
                params = endpoint.transformParams(params);
            }

            // call request
            fnct.call(this, params, endpoint, callback);

        };
    });
};
