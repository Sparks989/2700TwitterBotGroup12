// DEBUG
var debug = false;

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
		T.post('statuses/retweet/' + editText(retweetId), { }, function (error, response) {
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


var climateSearch = {q: "#climate", count: 1, result_type: "recent"};
var politicsSearch = {q: "#politics", count: 1, result_type: "recent"};
var techSearch = {q: "#tech", count: 1, result_type: "recent"};
var wildlifeSearch = {q: "#wildlife", count: 1, result_type: "recent"};

var paramList = [climateSearch, politicsSearch, techSearch, wildlifeSearch];

// Function that simply makes sure the code is compling without issue.
function test() {
	let Str = 'test';
	console.log(Str);
}

// Replies to a popular tweet with edited text.
function reTweet() {
	T.get('search/tweets',paramList[Math.floor(Math.random()*4)] , function(error,data,response) {
		if(response) {
			console.log('The getTweet() function worked!')
		} else if(error) {
			console.log('Back to the drawing board.')
		}
		tweetIt(editText(data.statuses[0].text));
	});
}

// Function modifies a string of text, capitalizing
// every even char and adding a '? ;)'. Returns the new string.
function editText(tweetText) {
	let newTweet = '';
	i = 0;
	while (i < tweetText.length) {
		if (i % 2 == 0) {
			newTweet = newTweet + tweetText[i].toUpperCase();
		} else {
			newTweet = newTweet + tweetText[i];
		}
		i++;
	}
	newTweet = newTweet + '? ;)';
	return newTweet;
}

// Function that tweets some text on command.
function tweetIt(txt) {
	var tweet = {
		status: txt
	}
	T.post('statuses/update', tweet, tweeted);
	function tweeted(err, data, response) {
		if (err) {
			console.log("Something went wrong in tweetIt()!");
		} else {
			console.log("The tweetIt() function worked!");
		}
	}
}

// Run the bot
//test();
//getTweet();
//console.log(editText('helloooooooo'));
//retweetLatest();
//tweetIt('Hello world!');
reTweet();
// And recycle every hour
setInterval(reTweet, 1000 * 60);
