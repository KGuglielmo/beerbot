"use strict";

const minimist = require('minimist');
const qs = require('qs');
const interactiveMsg = require('../interactiveMsg');
const argv = minimist(process.argv.slice(2));
const context = require('./context');
const req = require('./action-request');

process.env.SLACK_CHANNEL_NAMES = 'test';

const ctx = context();
ctx.then(res => console.log('response', res));

interactiveMsg(ctx, req(argv));