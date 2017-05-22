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
  let beerArr = [];
  let nameArr = [];
  let breweriesArr = [];
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
          nameArr.push(result);
          foundBeer = true;
        } else {
          beerArr.push(result.name);
        }
      });

      if (foundBeer === true) {
        if ( nameArr.length > 1 ) {
          nameArr.map(function(result) {
            breweriesArr.push({
              text: result.breweries[0].name,
              value: result.id
            });
          });

          botResponse = {
            text: `A lot of breweries use the name ${ beerName }.`,
            response_type: 'in_channel',
            attachments: [
              {
                text: `Choose the brewery with the ${ beerName } that you want me to tell you about.`,
                fallback: 'You are unable to choose a beer',
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
          
          // TODO choose the brewery and search with beer and brewery

        } else {
          botResponse = {
            text: nameArr[0].style.description
          };
        }
      } else {
        botResponse = {
          text: `Did you mean one of these beers? ${ beerArr.join(', ') }`
        };
        // TODO choose a beer and search again
      }


    } else {
      botResponse = 'Sorry, I\'m too drunk to remember anything about that beer.';
    }
    context.res = botResponse;
    context.done();
  });
};



