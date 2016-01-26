module.exports = {
	"twitterAuth": {
		"consumer_key": process.env.TWITTER_KEY,
		"consumer_secret": process.env.TWITTER_SECRET,
		"callback_url": process.env.APP_URL + "auth/twitter/callback"
	}
};