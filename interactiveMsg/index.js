'use strict';

const BreweryDb = require('brewerydb-node');
const brewdb = new BreweryDb('bcb8be42a4c08b303ae4efdf82aaaa3d');
const qs = require('qs');
const beerDescription = require('../beerDescription');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const body = qs.parse(req.body);
    const payload = JSON.parse(body.payload);
    const selectedVal = payload.actions[0].selected_options[0].value;

    context.log(selectedVal);

    if ( true ) {
      brewdb.beer.getById(selectedVal, {}, function(err,data) {
        if(data) {
          context.res = {
            response_type: 'in_channel',
            replace_original: true,
            text: data.style.description
          };
          context.done();
        } else {
          context.res = {
            response_type: 'in_channel',
            replace_original: true,
            text: "Error in finding that beer."
          };
          context.done();
        }
      });      
    } else {
      context.res = {
        "response_type": "ephemeral",
        "replace_original": false,
        "text": "Sorry, that didn't work. Please try again."
      };
      context.done();
    }
    
};