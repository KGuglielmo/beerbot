'use strict';

module.exports = function (context, slacktxt) {
  const BreweryDb = require('brewerydb-node');
  const brewdb = new BreweryDb(process.env.BREWERY_DB_API_KEY);
  const qs = require('qs');
  const services = require('../../core/services');

  const beerName = slacktxt.replace(/\./g, '').replace(/\?/g, '').replace(/\!/g, '').trim(); 
  let response; 
  let resultMatch = [];
  let resultUnmatch = [];
  let breweriesArr = [];
  let beerArr = [];
  let foundBeer = false;

  brewdb.search.beers({
    q: beerName,
    type: 'beer',
    withBreweries: 'Y'
  }, function(err, data) {
    if(data) {
      data.map((result) => {
        const beer = result.name.toLowerCase().trim();
        const chosenBeer = beerName.toLowerCase().trim();
        if ( beer === chosenBeer ) {
          resultMatch.push(result);
          foundBeer = true;
        } else {
          resultUnmatch.push(result);
        }
      });

      if (foundBeer === true) {
        if ( resultMatch.length > 1 ) { // Found multiple beer matches with the same name

          breweriesArr.push(resultMatch.map((result) => {
            return {
              text: result.breweries[0].name,
              value: result.id
            }
          }));

          response = services.slack.message(
            `A lot of breweries use the name *${ beerName }*.\n Which *${ beerName }* were you referring to?`,
            [
              {
                text: `Choose a brewery to get a description of its ${ beerName }.`,
                fallback: 'You are unable to choose a brewery',
                callback_id: 'brewery_choice',
                color: '#3AA3E3',
                attachment_type: 'default',
                actions: [
                  {
                    name: 'brewery_list',
                    text: 'Choose a brewery...',
                    type: 'select',
                    options: breweriesArr
                  }
                ]
              }
            ]
          );

        } else { // Found 1 beer match

          let icon = (resultMatch[0].labels && resultMatch[0].labels.icon) ? resultMatch[0].labels.icon : 'no image';

          response = services.slack.message(
            `I found a descriptiion of *${ beerName }* for you.`,
            [
              {
                fallback: `${ resultMatch[0].style.description }`,
                text: `${ resultMatch[0].style.description }`,
                image_url: icon,
                thumb_url: icon
              }
            ]
          );

        }

      } else { // Did not find an exact name match, but found similar options

        beerArr.push(resultUnmatch.map((result) => {
          return {
            text: result.name,
            value: result.id
          }
        }));

        response = services.slack.message(
          `I do not have an exact description for *${ beerName }*.\n Do any of these other beer names match what you were looking for?`,
          [
            {
              text: `Choose a beer to get its description.`,
              fallback: 'You are unable to choose a beer',
              callback_id: 'beer_choice',
              color: '#3AA3E3',
              attachment_type: 'default',
              actions: [
                {
                  name: 'beer_list',
                  text: 'Choose a beer...',
                  type: 'select',
                  options: beerArr
                }
              ]
            }
          ]
        );

      }
    } else { // No matches/data found
      context.log(err);
      response = services.slack.message(`${ beerName } is an invalid beer name.`);
    }

    context.res = response;
    context.done();

  });
};



