'use strict';

// node utils/beerbot.js
// node utils/beerbot.js --text="cheers"

const qs = require('qs');

const defaults = {
	token: 1,
	team_id: 'T0001',
	team_domain: 'example',
	channel_id: 'C2147483705',
	channel_name: 'test',
	timestamp: 1355517523.000005,
	user_id: 'U2147483697',
	user_name: 'Katherine',
  text: 'BeerStein, tell me about Yuengling.',
  trigger_word: 'BeerStein'
};

module.exports = function (params) {
  return {
    body: qs.stringify(Object.assign({}, defaults, params))
  };
};
