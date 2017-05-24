'use strict';

const BreweryDb = require('brewerydb-node');
const brewdb = new BreweryDb('bcb8be42a4c08b303ae4efdf82aaaa3d');
const qs = require('qs');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const body = qs.parse(req.body);
    const payload = JSON.parse(body.payload);
    const beerId = payload.actions[0].selected_options[0].value;

    brewdb.beer.getById(beerId, {
       withBreweries: 'Y'
    }, function(err,data) {
      if(data) {

        const botResponse = (payload.callback_id === 'brewery_choice') ? 
          `I found a description of *${ data.name }* from *${ data.breweries[0].name }* for you.` :
          `I found a description of *${ data.name }* for you.`;

        const icon = (data.labels && data.labels.icon) ? data.labels.icon : 'no image';

        context.res = {
          mrkdwn: true,
          response_type: 'in_channel',
          text: botResponse,
          attachments: [
            {
              fallback: `${ data.style.description }`,
              text: `${ data.style.description }`,
              image_url: icon,
              thumb_url: icon
            }
          ]
        };
        context.done();

      } else {
        context.res = {
          response_type: 'in_channel',
          replace_original: true,
          text: `Error! I cannot find the description of that beer.`
        };
        context.done();
      }
    });      
    
};