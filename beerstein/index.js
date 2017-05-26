'use strict';

const qs = require('qs');
const beerDescription = require('../commands/beer-description');
const cheers = require('../commands/cheers');
const services = require('../core/services');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const body = qs.parse(req.body);
    const name = body.user_name;
    const command = body.command;
    const slacktxt = body.text;
      
    if ( command === '/describe' ) {
        beerDescription(context, slacktxt);
    } else if ( command === '/cheers' ) {
        cheers(context, name);
    } else {
        services.slack.message(`I am too busy drinking to answer you right now.`);
        context.done();
    }
};