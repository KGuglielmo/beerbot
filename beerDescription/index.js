'use strict';

const BreweryDb = require('brewerydb-node');
const brewdb = new BreweryDb('bcb8be42a4c08b303ae4efdf82aaaa3d');
const qs = require('qs');


module.exports = function (context, slacktxt) {
  const beerName = slacktxt.replace(/\./g, '').replace(/\?/g, '').replace(/\!/g, '').trim(); 
  let botResponse; 
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
      data.map(function(result) {
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
          resultMatch.map(function(result) {
            breweriesArr.push({
              text: result.breweries[0].name,
              value: result.id
            });
          });

          botResponse = {
            mrkdwn: true,
            response_type: 'in_channel',
            text: `A lot of breweries use the name *${ beerName }*.\n 
                  Which *${ beerName }* were you referring to?`,
            attachments: [
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
          };

        } else { // Found 1 beer match
          botResponse = {
            mrkdwn: true,
            response_type: 'in_channel',
            text: `I found a descriptiion of *${ beerName }* for you.\n 
                  ${ resultMatch[0].style.description }`
          };
        }
      } else { // Did not find an exact name match, but found similar options
        resultUnmatch.map(function(result) {
          beerArr.push({
            text: result.name,
            value: result.id
          });
        });

        botResponse = {
          mrkdwn: true,
          response_type: 'in_channel',
          text: `I do not have an exact description for *${ beerName }*.\n 
                Do any of these other beer names match what you were looking for?`,
          attachments: [
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
        };
      }
    } else { // No matches/data found
      botResponse = {
        response_type: 'in_channel',
        text: `${ beerName } is an invalid beer name.`
      }
    }

    context.res = botResponse;
    context.done();

  });
};



