// Indicate the bot is running
console.log("Bot is starting up...");

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

// Our Twitter library, import the twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit(require('./config.js'));

// This is the URL of a search for the latest tweets on a hashtag.
var tagSearch = {q: "#nytimes", count: 10, result_type: "recent"}; 

// This function finds the latest teet with the #mediaarts hashtag, and retweets it.
function retweetLatest() {
	T.get('search/tweets', tagSearch, function (error, data) {

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

// This function gest the most recent tweet matching a hashtag and returns the text body
function getText() {
	T.get('search/tweets', {q: '#climate', count:1, result_type: 'recent'}, function(error,data) {
		// Catch exceptions
		if(error) {
			console.log('There was an error with getText()')
		}
		console.log(data.statuses);
	});
	// DOES NOT RETURN THE TEXT FIELD AS A STRING, ONLY AS UNDEFINED OBJECT
}



// This function removes the twitter handle and starts right at the first char of the body
function cleanText(txt) {
	let cleanText = "";
	for (let i = 0; i < txt.length; i++) {
		if (txt[i] == ':') {
			cleanText = txt.substr(i+2);
			break;
		}
		i++;
	}
	return cleanText;
}


function editText(tweetText) {
	var tweet = new String(tweetText);

	if(Math.random() > 0.5) {
	  	tweet = tweet + "?";
	} else {
		tweet = tweet + "Hello there"
	}
	return  tweet;
}


// Function that tweets whatever txt is - Verified Working
function tweetIt(txt) {
	var tweet = {
		status: txt
	}

	T.post('statuses/update', tweet, tweeted);

	function tweeted(err, data, response) {
		if (err) {
			console.log("Something went wrong!");
		} else {
			console.log("The tweetIt function worked!");
		}
	}
}



////var myStr = getText();
console.log(getText());
//console.log(getText());
//console.log(typeof myStr);
//let tweetString = getText();
//console.log(tweetString);
//cleanText(newText);
// Try to retweet something as soon as we run the program...
//retweetLatest();

//tweetIt("DoOoEeS it work??");

// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 1000 * 60 * 60);


console.log("\nFinished running!")