'use strict';

// node utils/beerbot.js
// node utils/beerbot.js --text="cheers"

const qs = require('qs');

const defaults = {
	token: 1,
	team_id: 'T0001',
	team_domain: 'example',
	enterprise_id: 'E0001',
	enterprise_name: 'Globular%20Construct%20Inc',
	channel_id: 'C2147483705',
	channel_name: 'test',
	user_id: 'U2147483697',
	user_name: 'Katherine',
	command: '/beerstein',
  text: 'tell me about Yuengling',
  response_url: 'https://hooks.slack.com/commands/1234/5678'
  // trigger_word: 'BeerStein'
};

module.exports = function (params) {
  return {
    body: qs.stringify(Object.assign({}, defaults, params))
  };
};


