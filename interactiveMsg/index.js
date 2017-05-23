'use strict';

const qs = require('qs');
const beerDescription = require('../beerDescription');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const body = qs.parse(req.body);
    const payload = JSON.parse(body.payload);
    context.log(body);
    context.log(payload);

    if (true) {
      context.log('Action URL finished!');
      context.done();

    } else {
      context.res = 'Invalid token.'
      context.done();
    }
    
};