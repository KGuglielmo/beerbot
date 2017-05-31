const request = require('request-promise-native');

const slashCommandUrl = process.env.SLASH_COMMAND_FUNCTION_URL;

const message = (text, attachments = '') => ({
	mrkdwn: true,
  response_type: 'in_channel',
  text,
  attachments
});

module.exports = {
  message,
  wakeSlashCommand: () => request.get(slashCommandUrl)
};