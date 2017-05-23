'use strict';

const qs = require('qs');
const beerDescription = require('../beerDescription');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const body = qs.parse(req.body);
    const payload = JSON.parse(body.payload);
    const selectedVal = payload.actions[0].selected_options[0].value;

    context.log(selectedVal);

    if ( payload.callback_id === 'beer_choice' ) {
      context.log('beer choice');
      context.res = {
        "response_type": "in_channel",
        "replace_original": true,
        "text": "Still under construction, but I'll show you your beer answer soon."
      };
      context.done();
    } else if ( payload.callback_id === 'brewery_choice' ) {
      context.log('brewery choice');
      context.res = {
        "response_type": "in_channel",
        "replace_original": true,
        "text": "Still under construction, but I'll show you your brewery answer soon."
      };
      context.done();
    } else {
      context.res = {
        "response_type": "ephemeral",
        "replace_original": false,
        "text": "Sorry, that didn't work. Please try again."
      };
      context.done();
    }
    
};