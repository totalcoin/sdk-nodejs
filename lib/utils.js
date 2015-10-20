/* jslint node:true */
/* jshint unused:true, eqnull:true, curly:true, eqeqeq:true, maxcomplexity:4, maxdepth:3 */

'use strict';

/*
 * Parse JSON
 */

module.exports.parseJSON = function(jsonStr) {
    var json;

    try {
        json = (jsonStr) ? JSON.parse(jsonStr) : null;
    } catch (e) {
        json = {
            HasError: true,
            ErrorMessage: 'JSON.parse: ' + e
        };
    }

    return json;
};

/*
 * Merge error domains
 */

var http_errors = require('./codes.json');

var lowLevelErrors = function(err) {
    return {
        HasError: err && true,
        ErrorMessage: err
    };
};

var httpErrors = function(err) {
    var http_error = http_errors[String(err.status)];
    return {
        HasError: http_error.class === 'Client Error' || http_error.class === 'Server Error',
        ErrorMessage: http_error.message,
        ErrorClass: http_error.class,
        ErrorStatus: err.status
    };
};

var apiErrors = function(response) {
    return (response.IsOK) ? {
        HasError: response.IsOK && true,
        ErrorMessage: response.Message || ''
    } : {
        HasError: false,
        ErrorMessage: null
    };
};

module.exports.mergeErrors = function(err, response) {

    return (err && err.errno) ? lowLevelErrors(err) :
        (err && err.status) ? httpErrors(err) :
        apiErrors(response);

};
