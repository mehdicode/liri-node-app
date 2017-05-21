var fs = require("fs");

var request = require("request");

var Twitter = require('twitter');

var casts = "";

var spotify = require('spotify');

var tk = require("./key.js");

var action = process.argv[2];

var songN = process.argv[3];

var movieN = process.argv[3];

var movieId;

switch (action) {
    case "my-tweets":
        twit();
        break;

    case "spotify-this-song":
        spot();
        break;

    case "movie-this":
        movie();
        break;

    case "do-what-it-says":
        what();
        break;
}

function twit() {
    var client = new Twitter(tk.twitterKeys);

    client.get('statuses/user_timeline', function(error, tweets, response) {
        if (error) {
            return console.log(error);
        }

        for (var i = 0; i < tweets.length; i++) {
            console.log(tweets[i].text);
        }
    });


};

function spot() {
    if (!songN) {
        songN = "The Sign ace of base";
        spotify.search({
            type: 'track',
            query: songN
        }, function(error, data) {
            if (error) {

                return console.log(error);
            }

            console.log(data.tracks.items[0].artists[0].name);
            console.log(data.tracks.items[0].name);
            console.log(data.tracks.items[0].external_urls.spotify);
            console.log(data.tracks.items[0].album.name);

        });
    } else {

        spotify.search({
            type: 'track',
            query: songN
        }, function(error, data) {

            if (error) {

                return console.log(error);
            }

            console.log(data.tracks.items[0].artists[0].name);
            console.log(data.tracks.items[0].name);
            console.log(data.tracks.items[0].external_urls.spotify);
            console.log(data.tracks.items[0].album.name);

        });

    }


};

function movie() {
    if (!movieN) {
        movieN = "Mr. Nobody.";

        request('http://api.themoviedb.org/3/search/movie?api_key=5937f1b53d76a465b205fbdad5b48396&language=en-US&page=1&append_to_response=credits&query=' + movieN, function(error, response, body) {


            if (!error) {

                // console.log(JSON.stringify(response, null, 2)); 
                movieId = JSON.parse(body).results[0].id;
                console.log(JSON.parse(body).results[0].original_title);
                console.log(JSON.parse(body).results[0].release_date);
                console.log(JSON.parse(body).results[0].vote_average);
                console.log(JSON.parse(body).results[0].original_language);


                request('https://api.themoviedb.org/3/movie/' + movieId + '?api_key=5937f1b53d76a465b205fbdad5b48396&append_to_response=credits', function(error, response, body) {

                    console.log(JSON.parse(body).production_countries[0].name);
                    // console.log(JSON.parse(body).homepage);
                    for (var i = 0; i < 10; i++) {
                        casts = casts + "" + JSON.parse(body).credits.cast[i].name;
                    }
                    console.log(casts);
                });
            }

        });


    } else {
        //console.log("im here");
        request('http://api.themoviedb.org/3/search/movie?api_key=5937f1b53d76a465b205fbdad5b48396&language=en-US&page=1&append_to_response=credits&query=' + movieN, function(error, response, body) {


            if (!error) {


                movieId = JSON.parse(body).results[0].id;
                console.log(JSON.parse(body).results[0].original_title);
                console.log(JSON.parse(body).results[0].release_date);
                console.log(JSON.parse(body).results[0].vote_average);
                console.log(JSON.parse(body).results[0].original_language);


                request('https://api.themoviedb.org/3/movie/' + movieId + '?api_key=5937f1b53d76a465b205fbdad5b48396&append_to_response=credits', function(error, response, body) {

                    console.log(JSON.parse(body).production_countries[0].name);
                    console.log(JSON.parse(body).homepage);
                    for (var i = 0; i < 10; i++) {
                        casts = casts + "" + JSON.parse(body).credits.cast[i].name;
                    }
                    console.log(casts);

                });

            }


        });

    }

};

function what() {

};