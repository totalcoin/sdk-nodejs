/* jslint node:true */
/* jshint unused:true, eqnull:true, curly:true, eqeqeq:true, maxcomplexity:4, maxdepth:3 */

'use strict';

/*
 * Constants & Globals
 */

var constants = require('./constants.js'),
    http_errors = require('./codes.json'),
    TokenId = null;

/*
 * Common variables
 */

var basepath = 'https://api.totalcoin.com/ar-test/',
    default_headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': 0
    };

/*
 * Endpoints exports
 */

module.exports = {
    Authorize: function(tc) {
        this.method = 'post';
        this.type = 'form';
        this.headers = default_headers;
        this.url = basepath + 'Security/';
        this.transformParams = function() {
            return {
                Email: tc.user,
                ApiKey: tc.appkey
            };
        };

        this.transformResponse = function(response) {
            TokenId = response && response.Response && response.Response.TokenId;
            return;
        };

        this.transformErrors = function(error) {
            error.ErrorMessage = (error.ErrorClass) ? error.ErrorClass + ': ' + error.ErrorMessage : error.ErrorMessage;
            return error;
        };

        return this;
    },
    Checkout: function() {
        this.method = 'post';
        this.url = basepath + 'Checkout/' + TokenId + '/';
        this.headers = default_headers;

        this.transformParams = function(params) {
            params.Country = params.Country || constants.default.COUNTRY;
            params.Currency = params.Currency || constants.default.CURRENCY;
            params.PaymentMethods = params.PaymentMethods || constants.default.PAYMENTMETHODS;
            return params;
        };

        this.transformResponse = function(response) {
            return response.Response.URL;
        };

        this.transformErrors = function(error) {
            switch (error.ErrorStatus) {
                case 400:
                    error.ErrorStatus = 498;
                    var httpError = http_errors[String(error.ErrorStatus)];
                    error.ErrorMessage = httpError.message;
                    error.ErrorClass = httpError.class;
                    break;
            }
            error.ErrorMessage = (error.ErrorClass) ? error.ErrorClass + ': ' + error.ErrorMessage : error.ErrorMessage;
            return error;
        };

        return this;
    },
    GetMerchants: function() {
        this.method = 'get';
        this.headers = default_headers;
        this.url = basepath + 'Merchant/' + TokenId + '/';
        this.transformParams = function() {
            return {};
        };

        this.transformResponse = function(response) {
            return response.Response;
        };

        this.transformErrors = function(error) {
            switch (error.ErrorStatus) {
                case 400:
                    error.ErrorStatus = 498;
                    var httpError = http_errors[String(error.ErrorStatus)];
                    error.ErrorMessage = httpError.message;
                    error.ErrorClass = httpError.class;
                    break;
            }
            error.ErrorMessage = (error.ErrorClass) ? error.ErrorClass + ': ' + error.ErrorMessage : error.ErrorMessage;
            return error;
        };

        return this;
    },
    GetIpnInfo: function(tc) {
        this.method = 'get';
        this.headers = default_headers;
        this.url = basepath + 'Ipn/' + tc.appkey + '/';

        this.transformParams = function(params) {
            this.url = (params.referenceID) ? this.url + params.referenceID + '/' : this.url;
            return {};
        };

        this.transformResponse = function(response) {
            return response && response.Response;
        };

        this.transformErrors = function(error) {
            switch (error.ErrorStatus) {
                case 400:
                    error.ErrorStatus = 498;
                    var httpError = http_errors[String(error.ErrorStatus)];
                    error.ErrorMessage = httpError.message;
                    error.ErrorClass = httpError.class;
                    break;
            }
            error.ErrorMessage = (error.ErrorClass) ? error.ErrorClass + ': ' + error.ErrorMessage : error.ErrorMessage;
            return error;
        };

        return this;
    }
};
