const message = (text, attachments = '') => ({
	mrkdwn: true,
  response_type: 'in_channel',
  text,
  attachments
});

module.exports = {
  message
};