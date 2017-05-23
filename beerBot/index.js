'use strict';

const qs = require('qs');
const beerDescription = require('../beerDescription');
const cheers = require('../cheers');

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
        context.res = {
          response_type: 'in_channel',
          text: 'I\'m too busy drinking to answer you right now.'
        };
        context.done();
    }
};