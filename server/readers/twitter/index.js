var Twitter = require('twitter');		// The module to work with the twitter API

/** Initialize the Twitter client */
var client = new Twitter({
	consumer_key: process.env.twitter_consumer_key,
	consumer_secret: process.env.twitter_consumer_secret,
	access_token_key: process.env.twitter_access_token_key,
	access_token_secret: process.env.twitter_access_token_secret
});

const readTimeline = (screen_name, count, cb) => {
    var params = { screen_name: screen_name, count: count }
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
        console.log('Number of tweets read:', tweets.length);
        cb(tweets);
        return tweets;
    } else {
            console.log('Twitter read error (readTimeline):', error);
            return null;
        }
    }); 
}

const searchTweets = (query, count, cb) => {
    var params = { q:query, count:count };
    client.get('search/tweets', params, function(error, tweets, response) {
        tweets = tweets.statuses;
        if (!error) {
            console.log('Number of tweets read:', tweets.length);
            cb(tweets);
            return tweets;
        } else {
            console.log('Twitter read error (searchTweets):', error);
            return null;
        }
    });
}

module.exports = {
    readTimeline, 
    searchTweets
}