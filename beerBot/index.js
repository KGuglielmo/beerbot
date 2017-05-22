'use strict';

const qs = require('qs');
const beerDescription = require('../beerDescription');
const cheers = require('../cheers');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log(req);

    const body = qs.parse(req.body);
    const name = body.user_name;
    const slacktxt = body.text;

    // if (process.env.SLACK_CHANNEL_NAMES.split(' ').indexOf(body.channel_name) === -1) {
    //   context.log(`Kegbot not available in #${ body.channel_name }`);
    //   context.done();
    // } else 
    if (true) {
      
      if ( slacktxt.indexOf('tell me about') > -1 ) {
          beerDescription(context, slacktxt);
      } else if ( slacktxt.indexOf('cheers') > -1 ) {
          cheers(context, name);
      } else {
          context.res = {
            response_type: 'in_channel',
            text: 'I\'m too busy drinking to answer you right now.'
          };
          context.done();
      }

    } else {
      context.res = 'Invalid token.'
      context.done();
    }
    
};