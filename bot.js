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
function retweetLatest() {
	T.get('search/tweets', mediaArtsSearch, function (error, data) {
	  // log out any errors and responses
	  console.log(error, data);
	  // If our search request to the server had no errors...
	  if (!error) {
	  	// ...then we grab the ID of the tweet we want to retweet...
		var retweetId = data.statuses[0].id_str;
		// ...and then we tell Twitter we want to retweet it!
		T.post('statuses/retweet/' + retweetId, { }, function (error, response) {
			if (response) {
				console.log('Success! Check your bot, it should have retweeted something.')
			}
			// If there was an error with our Twitter call, we print it out here.
			if (error) {
				console.log('There was an error with Twitter:', error);
			}
		})
	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}

// Replies to a top rated tweet with edited text.




function getText() {
	T.get('search/tweets', {q: '#climate', count:1, result_type: 'recent'}, function(error,data,response) {
		if(response) {
			console.log('Get that bread!')
		} else if(error) {
			console.log('Back to the drawing board.')
		}
		let tweetText = data.statuses[0].text;
		return tweetText;
	});
}

function editText(tweetText) {
	var tweet = new String(tweetText);
	for(var i = 0; i < tweet.length; i++){
	  	if(Math.random() > 0.5){
	  		tweet[i] = tweet[i].toUpperCase;
	  	}
	}
	if(Math.random() > 0.5) {
	  	tweet = tweet + "?";
	} else {
		tweet = tweet + "Hello there"
	}
	return  tweet;
}

function tweetIt(txt) {
	var tweet = {
		status: txt
	}

	T.post('statuses/update', tweet, tweeted);

	function tweeted(err, data, response) {
		if (err) {
			console.log("Something went wrong!");
		} else {
			console.log("It worked!");
		}
	}
}


console.log(editText());
console.log(editText(editText()));