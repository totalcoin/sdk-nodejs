/* jslint node:true */
/* jshint unused:true, eqnull:true, curly:true, eqeqeq:true, maxcomplexity:4, maxdepth:3 */

'use strict';

var constants = {
    COUNTRY: {
        argentina: 'ARG'
    },
    CURRENCY: {
        pesos_argentinos: 'ARS'

    },
    PAYMENTMETHODS: {
        cash: 'CASH',
        creditcard: 'CREDITCARD',
        totalcoin: 'TOTALCOIN'
    }
};

module.exports = constants;

module.exports.default = {
    COUNTRY: constants.COUNTRY.argentina,
    CURRENCY: constants.CURRENCY.pesos_argentinos,
    PAYMENTMETHODS: constants.PAYMENTMETHODS.cash
};
