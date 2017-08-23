"use strict";

var express = require('express');
var router = express.Router();

var tr = require('../readers/twitter')
var oraWriter = require('../writers/oracleCloudDb')
var log = require('../writers/localLowDb')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.get('/test', function(req, res, next) {
  console.log(req.query);
  res.render('index', { title: 'The Tester' });
});

/** -------------------------------------------------- */
/** ----------   R E A D   T W E E T S   ------------- */
/** -------------------------------------------------- */
router.get('/read', function(req, res, next) {
  var screen_name = req.query.screen_name?req.query.screen_name:'VertexPharma'
  let count = req.query.count?Number(req.query.count):15
  tr.readTimeline(screen_name, count, 
    (tweets) => {
      oraWriter.writeTweets(tweets)
//      oraWriter.writeUsers(tweets)
    })
  log.writeLog( { action:'readTimeLine', parameter1: { screen_name: screen_name, count: count } } )
  //res.render('index', { title: 'Read Tweets' });
  res.json({ message: "Read tweets"})
});




module.exports = router;
