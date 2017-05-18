const beerDescription = require('../beerDescription');
const cheers = require('../cheers');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    const params = req.body.split('&');
    let name, slacktxt; 
 
    if (params.length > 0) {
        params.map(function (str) {
            if (str.search('user_name') > -1) {
                name = str.split('=')[1];
            }
            if (str.search('text') > -1) {
                slacktxt = str.split('=')[1];
            }
        });

        context.log(slacktxt);

         if ( slacktxt.indexOf("tell+me+about+") > -1 ) {
            beerDescription(context, slacktxt);
        } else if ( slacktxt.indexOf("cheers") > -1 ) {
            cheers(context, name);
        } else {
            context.res = {
                text: "I'm too busy drinking to answer you right now."
            };
            context.done();
        }
    } else {
        context.res = {
            status: 400,
            text: "The BeerStein is too busy for your childish questions right now."
        }
        context.done();
    }

    
};