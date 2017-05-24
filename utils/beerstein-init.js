"use strict";

const minimist = require('minimist');
const qs = require('qs');
const beerstein = require('../beerstein');
const argv = minimist(process.argv.slice(2));
const context = require('./context');
const req = require('./slack-request');

process.env.SLACK_CHANNEL_NAMES = 'test';

const ctx = context();
ctx.then(res => console.log('response', res));

beerstein(ctx, req(argv));