"use strict";

var qs = require("querystring")
var http = require("https")  // https://nodejs.org/api/https.html

var tr = require('../../readers/twitter')

const params = {
    hostname: process.env.odbcs_hostname,
    path: { 
        tweets: "/apex/smf_tweets/", 
        users: "/apex/smf_users/",
        urls: "/apex/smf_urls/",
        hashtags: "/apex/smf_hashtags/"
    }    
}

const optionsCommon = {
    "hostname": params.hostname,
    "port": null,
    "headers": {
      "content-type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache"
    }
  };

  // test
const readTweets = (screenName) => {
    tr.readTimeline(screenName, writeTweets)
}

const postCall = (path, data, cb) => {
    let options = optionsCommon
    options.method = "POST"
    options.path = path

    // Initiate the request object
    var req = http.request(options, (res) => {
        var chunks = [];
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });        
        res.on("end", function () {
            let body = Buffer.concat(chunks);
            if(cb) cb(body)
        });
    });
    // Make the call to write to db
    req.write(qs.stringify(data))
    req.end()
}

/** ****** W R I T E   T W E E T    ******* */
/** Write a tweet to the Oracle Cloud DB    */
const writeTweet = (tweetIn, cb) => {
    // Prepare the object to write to DB
    let tweetOut = {
        id: tweetIn.id,
        text: tweetIn.text,
        user_id: tweetIn.user.id,
        created_at: tweetIn.created_at,
        retweet_of_twid: tweetIn.retweeted_status?tweetIn.retweeted_status.id:0
    }
    //  Make the call
    postCall(params.path.tweets, tweetOut, cb)
    
}


/** ****** W R I T E   U S E R    ******* */
/** Write a user to the Oracle Cloud DB    */
const writeUser = (userIn, cb) => {
/*     let options = optionsCommon
    options.method = "POST"
    options.path = params.path.users
    //console.log("Options:", options)
    // Initiate the request object
    let req = http.request(options) */
    // Prepare the object to write to DB
    let userOut = {
        tw_user_id: userIn.id ,
        name: userIn.name,
        screen_name: userIn.screen_name,
        location: userIn.location,
        url: userIn.url,
        description: userIn.description,
        followers_count: userIn.followers_count,
        friends_count: userIn.friends_count,
        favorites_count: userIn.favorites_count,
        statuses_count: userIn.statuses_count,
        tw_created_at: userIn.created_at
    }
    // Make call and write
/*     req.write(qs.stringify(userOut));
    req.end();
 */
    postCall(params.path.users, userOut, cb)
}

/** ****** W R I T E   H A S H T A G S   ******* */
/** Write hashtags to the Oracle Cloud DB        */
const writeHashtags = (twid, hashtagsIn, cb) => {
    if(!Array.isArray(hashtagsIn) || hashtagsIn.length===0) return
/*     let options = optionsCommon
    options.method = "POST"
    options.path = params.path.hashtags */

/*     // Initiate the request object
    var req = http.request(options);
 */    
    // Prepare the object to write to DB
    hashtagsIn.forEach((hashtag) => { 
        let hashtagOut = {
            tw_id: twid,
            hashtag: hashtag.text
        }
        // Make call and write
        postCall(params.path.hashtags, hashtagOut, cb)
/*         req.write(qs.stringify(hashtagOut));         */
    })
/*     req.end(); */
}

/** ****** W R I T E   U R L S       ******* */
/** Write hashtags to the Oracle Cloud DB    */
const writeUrls = (twid, urlsIn, cb) => {
    if(!Array.isArray(urlsIn) || urlsIn.length===0) return
/*     let options = optionsCommon
    options.method = "POST"
    options.path = params.path.urls */

    // Initiate the request object
/*     var req = http.request(options); */
    // Prepare the object to write to DB
    urlsIn.forEach((url) => {
        let urlOut = {
            tw_id: twid,
            url: url.url,
            expanded_url: url.expanded_url,
            display_url: url.display_url
        }
        // Make call and write
        postCall(params.path.urls, urlOut, cb)
/*         req.write(qs.stringify(urlOut)); */        
    })
/*     req.end(); */
}

const writeUsers = (tweets) => {
    if(Array.isArray(tweets)) {
        tweets.forEach(tweet => {
            writeUser(tweet.user)
            writeHashtags(tweet.id, tweet.entities.hashtags)
            writeUrls(tweet.id, tweet.entities.urls)
        })
    }
}

const writeTweets = (tweets) => {
    if(Array.isArray(tweets)) {
        tweets.forEach(tweet => {
            writeTweet(tweet)
            writeUser(tweet.user)
            writeHashtags(tweet.id, tweet.entities.hashtags)
            writeUrls(tweet.id, tweet.entities.urls)
        })
    }
}

module.exports = {
    readTweets,
    writeTweets,
    writeUsers
}


/*         
        , (res) => {
    console.log('Status: ',res.statusCode);
        if(cb) {
            cb({ result: res.headers.result, message: res.headers.message })
            }
        }
        var chunks = [];
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });        
        res.on("end", function () {
            var body = Buffer.concat(chunks);
        });
 */