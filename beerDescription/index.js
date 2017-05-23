'use strict';

const BreweryDb = require('brewerydb-node');
const brewdb = new BreweryDb('bcb8be42a4c08b303ae4efdf82aaaa3d');
const qs = require('qs');

// TODO
// what if two beers have the same name i.e. Virginia Lager, Oktoberfest? list the possibility of answers to choose from
// what if you get close to the name of the beer but not the exact name, i.e. Yuenging Lager/Yuengling Traditional Lager
// double check that my regex will work for all scenarios



module.exports = function (context, slacktxt) {
  const beerName = slacktxt.split('tell me about')[1].replace(/\./g, '').replace(/\?/g, '').replace(/\!/g, '').trim(); //.replace(/\b[-.,()&$#!\[\]{}"']+\B|\B[-.,()&$#!\[\]{}"']+\b/g, "").trim();
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

          context.log(breweriesArr);

          botResponse = {
            text: `A lot of breweries use the name ${ beerName }.`,
            response_type: 'in_channel',
            attachments: [
              {
                text: `Choose the brewery with the ${ beerName } that you want me to tell you about.`,
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
            response_type: 'in_channel',
            text: resultMatch[0].style.description
          };
        }
      } else { // Did not find an exact name match, but found similar options
        resultUnmatch.map(function(result) {
          beerArr.push({
            text: result.name,
            value: result.id
          });
        });

        context.log(beerArr);

        botResponse = {
          response_type: 'in_channel',
          text: `Sorry, ${ beerName } does not sound familiar to me. But maybe you meant a different beer name?`,
          attachments: [
            {
              text: `Choose the correct beer.`,
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
        text: 'Sorry, I\'m too drunk to remember anything about that beer.'
      }
    }
    context.res = botResponse;
    context.done();
  });
};



