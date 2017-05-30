'use strict';

module.exports = function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');
  const BreweryDb = require('brewerydb-node');
  const brewdb = new BreweryDb(process.env.BREWERY_DB_API_KEY);
  const qs = require('qs');
  const services = require('../core/services');

  const body = qs.parse(req.body);
  const payload = JSON.parse(body.payload);
  const beerId = payload.actions[0].selected_options[0].value;

  brewdb.beer.getById(beerId, {
     withBreweries: 'Y'
  }, function(err,data) {
    if(data) {

      const text = (payload.callback_id === 'brewery_choice') ? 
        `I found a description of *${ data.name }* from *${ data.breweries[0].name }* for you.` :
        `I found a description of *${ data.name }* for you.`;

      const icon = (data.labels && data.labels.icon) ? data.labels.icon : 'no image';

      context.res = services.slack.message(
        text,
        [
          {
            fallback: `${ data.style.description }`,
            text: `${ data.style.description }`,
            color: 'good',
            image_url: icon,
            thumb_url: icon
          }
        ]
      );
      context.done();

    } else {
      services.slack.message(`Error! I cannot find the description of that beer.`);
      context.done();
    }
  });      
    
};