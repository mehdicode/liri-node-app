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
            var tText = tweets[i].text;
            console.log(tText);
            fs.appendFileSync('log.txt',"\r\n" + action + " => " + tText);
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
            var artist = data.tracks.items[0].artists[0].name;
            var song = data.tracks.items[0].name;
            var url = data.tracks.items[0].external_urls.spotify;
            var album = data.tracks.items[0].album.name;
            if (error) {

                return console.log(error);
            }


            console.log(artist);
            console.log(song);
            console.log(url);
            console.log(album);
            fs.appendFileSync('log.txt',"\r\n" + action + " => " + artist + ", " + song + ", " + url + ", " + album);

        });
    } else {

        spotify.search({
            type: 'track',
            query: songN
        }, function(error, data) {
            var artist = data.tracks.items[0].artists[0].name;
            var song = data.tracks.items[0].name;
            var url = data.tracks.items[0].external_urls.spotify;
            var album = data.tracks.items[0].album.name;

            if (error) {

                return console.log(error);
            }

            console.log(artist);
            console.log(song);
            console.log(url);
            console.log(album);
            fs.appendFileSync('log.txt',"\r\n" + action + " " + songN + " => " + artist + ", " + song + ", " + url + ", " + album);

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
                var title = JSON.parse(body).results[0].original_title;
                var date = JSON.parse(body).results[0].release_date;
                var rate = JSON.parse(body).results[0].vote_average;
                var lan = JSON.parse(body).results[0].original_language;
                console.log(title);
                console.log(date);
                console.log(rate);
                console.log(lan);
                fs.appendFileSync('log.txt',"\r\n" + action + " " + movieN + " => " + title + ", " + date + ", " + rate + ", " + lan);


                request('https://api.themoviedb.org/3/movie/' + movieId + '?api_key=5937f1b53d76a465b205fbdad5b48396&append_to_response=credits', function(error, response, body) {

                    var country = JSON.parse(body).production_countries[0].name;
                    var url = JSON.parse(body).homepage;
                    console.log(country);
                    console.log(url);
                    for (var i = 0; i < 10; i++) {
                        casts += ", " + JSON.parse(body).credits.cast[i].name;
                    }
                    console.log(casts);
                    fs.appendFileSync('log.txt', country + ", " + url + ", " + casts);
                });
            }

        });


    } else {
        //console.log("im here");
        request('http://api.themoviedb.org/3/search/movie?api_key=5937f1b53d76a465b205fbdad5b48396&language=en-US&page=1&append_to_response=credits&query=' + movieN, function(error, response, body) {

            if (!error) {

                movieId = JSON.parse(body).results[0].id;
                var title = JSON.parse(body).results[0].original_title;
                var date = JSON.parse(body).results[0].release_date;
                var rate = JSON.parse(body).results[0].vote_average;
                var lan = JSON.parse(body).results[0].original_language;

                console.log(title);
                console.log(date);
                console.log(rate);
                console.log(lan);
                fs.appendFileSync('log.txt', "\r\n" +action + " " + movieN + " => " + title + ", " + date + ", " + rate + ", " + lan);

                request('https://api.themoviedb.org/3/movie/' + movieId + '?api_key=5937f1b53d76a465b205fbdad5b48396&append_to_response=credits', function(error, response, body) {

                    var country = JSON.parse(body).production_countries[0].name;
                    var url = JSON.parse(body).homepage;
                    console.log(country);
                    console.log(url);
                    for (var i = 0; i < 10; i++) {
                        casts += ", " + JSON.parse(body).credits.cast[i].name;
                    }
                    console.log(casts);
                    fs.appendFileSync('log.txt', country + ", " + url + ", " + casts);

                });

            }

        });

    }

};

function what() {
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        switch (dataArr[0]) {
            case "my-tweets":
                twit();
                break;

            case "spotify-this-song":
                songN = dataArr[1];
                spot();
                break;

            case "movie-this":
                movieN = dataArr[1];
                movie();
                break;

            case "do-what-it-says":
                what();
                break;
        }

    });

};