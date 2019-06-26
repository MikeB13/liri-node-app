require("dotenv").config();
// Adding all the required code to import and store they keys.js

var keys = require("./keys");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var fs = require("fs");

var Spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret,
});

var defaultMovie = "Mr. Nobody";

var action = process.argv[2];
var value = process.argv[3];

switch (action) {
    case "concert-this":
        getBands(value)
        break;
    case "spotify-this-song":
        getSongs(value)
        break;
    case "movie-this":
        if (value == "") {
            value = defaultMovie;
        }

        getMovies(value)
        break;
    case "do-what-it-says":
        doWhatItSays()
        break;
    default:
        break;
}

function getBands(artist) {
    axios.get(`"https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"`)
        .then(function(response) {
            console.log("Name of the Venue:", response.data[0].venue.city);
            console.log("Venue Location:", response.data[0].venue.city);
            var eventDate = moment(response.data[0].datetime).format('MM/DD/YYYY');
            console.log("Date of the Event:", eventDate);
        })
        .catch(function(error) {
            console.log(error);
        });
}

function getSongs(songName) {
    if (songName === "") {
        songName = "I Saw the Sign";
    }
    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
            return console.log('error occurred: ' + err);
        }
        console.log("Artists: ", data.tracks.items[0].album.artists[0].name)
        console.log("Preview Link: ", data.tracks.items[0].preview_url)
        console.log("Album NAme: ", data.tracks.itmes[0].album.name)
    });
}

function getMovies(movieName) {
    axios.get("http://www.omdbapi.com/?apikey=eb94b376&t=" + movieName)
        .then(function(data) {
            var result = `
                
        Title of the movie: ${data.data.Title}
        Year the movie came out: ${data.data.Year}
        IMDB Rating of the movie: ${data.data.Rated}
        Rotten Tomatoes Rating of the movie: ${data.data.Ratings[1].Value}
        Country where the movie was produced: ${data.data.Country}
        Language of the movie: ${data.data.Language}
        Plot of the movie: ${data.data.Plot}
        Actors in the movie: ${data.data.Actors}`;

            console.log(result)

        })
        .catch(function(error) {
            console.log(error);
        });
    if (movieName === "Mr. Nobody") {
        console.log("If you havent watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/")
        console.log("Its on Netflix!");
    };
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        data = data.split(",");
        var action = data[0]
        var value = data[1]

        switch (action) {
            case "concert-this":
                getBands(value)
                break;

            case "spotify-this-song":
                getSongs(value)
                break;

            case "movie-this":
                getMovies(value)
                break;
            default:
                break;

        }
    });
}