// DEBUG
var debug = false;

// Wordnik stuff
var WordnikAPIKey = 'o222xzwlqvqzi7mr7xy9jnu9ssdfceg5km0bjl86y34115a93';
var request = require('request');
var inflection = require('inflection');
var pluralize = inflection.pluralize;
var capitalize = inflection.capitalize;
var singularize = inflection.singularize;
var pre;	// store prebuilt strings here.

// Blacklist
var wordfilter = require('wordfilter');

// Our Twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit(require('./config.js'));

// This is the URL of a search for the latest tweets on the '#mediaarts' hashtag.
var mediaArtsSearch = {q: "#mediaarts", count: 10, result_type: "recent"}; 

// This function finds the latest teet with the #mediaarts hashtag, and retweets it.
function retweetLatest = () => {
	T.get('search/tweets', mediaArtsSearch, function (error, data) => {
	  // log out any errors and responses
	  console.log(error, data),
	  // If our search request to the server had no errors...
	  if (!error) {
	  	// ...then we grab the ID of the tweet we want to retweet...
		var retweetId = data.statuses[0].id_str;
		// ...and then we tell Twitter we want to retweet it!
		T.post('statuses/retweet/' + retweetId, {}, (error, response) => {
			if (response) {
				console.log('Success! Check your bot, it should have retweeted something.')
			}
			// If there was an error with our Twitter call, we print it out here.
			if (error) {
				console.log('There was an error with Twitter:', error);
			}
		})
	  } else {
	  // However, if our original search request had an error, we want to print it out here.
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}

// Try to retweet something as soon as we run the program...
retweetLatest();
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 1000 * 60 * 60);

//////////////////////////////////////////////////////////////////////////////////////////////////////


var stream = T.stream('user');

//This particular stream function detects whether someone has followed your bot or has mentioned it anywhere.
stream._on('follow', followed);
stream._on('tweet', tweetEvent);

function followed(eventMessage) {
	var name = eventMessage.source.name;
	var screenName = eventMessage.source.screen_name;
	tweetStatus('@' + screenName + ' Thank you for following me!');
}
//The tweetEvent() function detects whether our username was mentioned anywhere on Twitter and replies back.
function tweetEvent(tweetMSG) {
	var fs = request('fs');
	var json = JSON.stringify(tweetMSG, null, 2);
	fs.writeFile("tweets.json", json);

	var replyTo = tweet.om_reply_to_screem_name;
	var text = tweetMSG.text;
	var from = tweetMSG.user.screen_name;

	console.log(replyTo + from);
	console.log(text);
	console.log();

	if (replyTo == 'Tweets4retweets') {
		var newTweet = ('@' + from + " Thank you for mentioning me! #MediumRocks");
		tweetStatus(newTweet);
	}
}

//im trying to do code the following the people part...sorry about the delay
function follow() {
	T.get('statuses/mentions_timeline', { count:50, include_rts:1 },  function (err, reply) {
		  if (err !== null) {
			console.log('Error: ', err);
		 } else {
		  	var sn = reply.pick().user.screen_name;
			if (debug) {
				console.log(sn);
		    } else {
				//Now follow that user
				T.post('friendships/create', {screen_name: sn }, function (err, reply) {
					if (err !== null) {
						console.log('Error: ', err);
					} else {
						console.log('Followed: ' + sn);
					}
				});
			}
		}
	});
}
