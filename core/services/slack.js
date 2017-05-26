const message = (text, attachements = '') => ({
	mrkdwn: true,
  response_type: 'in_channel',
  text,
  attachements
});

module.exports = {
  message
};