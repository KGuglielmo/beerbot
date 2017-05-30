'use strict';

const services = require('../../core/services');

module.exports = function (context, name) {
  context.res = services.slack.message(
    `Cheers to you, ${ name }!`,
    [
      {
        fallback:  `Cheers!`,
        image_url: 'https://thechive.files.wordpress.com/2017/02/cheers_lead.jpg?quality=85&strip=info'
      }
    ]
  );
  context.done();
};