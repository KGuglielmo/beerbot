const BreweryDb = require('brewerydb-node');
const brewdb = new BreweryDb('bcb8be42a4c08b303ae4efdf82aaaa3d');

// TODO
// what if two beers have the same name i.e. Virginia Lager, Oktoberfest? list the possibility of answers to choose from
// what if you get close to the name of the beer but not the exact name, i.e. Yuenging Lager/Yuengling Traditional Lager


module.exports = function (context, slacktxt) {
    const beerName = slacktxt.split("about+")[1].replace(/[.,\/#!$%\^&\*;:{}=\_`~]/g,"").replace(/\+/g,' ');
    let botResponse; 

    brewdb.search.beers({
        q: beerName
    }, function(err, data) {
        if(data) {
            for(let i = 0; i < data.length; i++) {
                let beer = data[i].name.toLowerCase().trim();
                if ( beer === beerName.toLowerCase().trim() ) {
                    botResponse = data[i].style.description;
                    break;
                } else {
                    botResponse = "Sorry, I've never had that beer before."
                }
            }
        } else {
            botResponse = "Sorry, I'm too drunk to remember anything about that beer.";
        }
        context.res = {
            text: botResponse
        }
        context.done();
    });
};