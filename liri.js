require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);

var divider =
"\n------------------------------------------------------------\n\n";


var getArtistNames = function(artist) {
    return artist.name;
  };

  var getMeSpotify = function(songName) {
    if (songName === undefined) {
      songName = "What's my age again";
    }
    spotify.search(
      {
        type: "track",
        query: songName
      },
      function(err, data) {
        if (err) {
          console.log("Error occurred: " + err);
          return;
        }
        var songs = data.tracks.items;
        for (var i = 0; i < songs.length; i++) {

          var songData = [
          i,
          "artist(s): " + songs[i].artists.map(getArtistNames),
          "song name: " + songs[i].name,
          "preview song: " + songs[i].preview_url,
          "album: " + songs[i].album.name,
          "-----------------------------------"
        ].join("\n\n");

        fs.appendFile("log.txt", songData + divider, function(err) {
          if (err) throw err;
          console.log(songData);
        });
      }
      });
  };


  var getMeConcert = function(artist) {
      if (artist === undefined) {
          artist = "Post Malone";
      }
      var urlHit = 
      "https://rest.bandsintown.com/artists/" + 
      artist + 
      "/events?app_id=codingbootcamp";
      request(urlHit, function(error, response, body){
          if (!error && response.statusCode === 200) {
              var jsonData = JSON.parse(body);

              var concertData = [
              "Venue: " + jsonData[0].venue.name,
              "Event Country: " + jsonData[0].venue.country,
              "Event City: " + jsonData[0].venue.city,
              "Event Date/Time: " + jsonData[0].datetime
            ].join("\n\n");

            fs.appendFile("log.txt", concertData + divider, function(err) {
              if (err) throw err;
              console.log(concertData);
            });
          }
      });
  }

  var getMeMovie = function(movieName) {
    if (movieName === undefined) {
      movieName = "Mr Nobody";
    }
    var urlHit =
      "http://www.omdbapi.com/?t=" +
      movieName +
      "&y=&plot=full&tomatoes=true&apikey=trilogy";
    request(urlHit, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var jsonData = JSON.parse(body);
        var movieData = [
        "Title: " + jsonData.Title,
        "Year: " + jsonData.Year,
        "Rated: " + jsonData.Rated,
        "IMDB Rating: " + jsonData.imdbRating,
        "Country: " + jsonData.Country,
        "Language: " + jsonData.Language,
        "Plot: " + jsonData.Plot,
        "Actors: " + jsonData.Actors,
        "Rotton Tomatoes Rating: " + jsonData.Ratings[1].Value
        ].join("\n\n");

        fs.appendFile("log.txt", movieData + divider, function(err) {
          if (err) throw err;
          console.log(movieData);
        });
      }
    });
  };

  var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
      console.log(data);
      var dataArr = data.split(",");
      if (dataArr.length === 2) {
        pick(dataArr[0], dataArr[1]);
      } else if (dataArr.length === 1) {
        pick(dataArr[0]);
      }
    });
  };

  // Function for determining which command is executed
var pick = function(caseData, functionData) {
    switch (caseData) {
        case "concert-this":
        getMeConcert(functionData);
        break;
      case "spotify-this-song":
        getMeSpotify(functionData);
        break;
      case "movie-this":
        getMeMovie(functionData);
        break;
      case "do-what-it-says":
        doWhatItSays();
        break;
      default:
        console.log("LIRI doesn't know that");
    }
  };
  // Function which takes in command line arguments and executes correct function accordigly
  var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
  };
  // MAIN PROCESS
  // =====================================
  runThis(process.argv[2], process.argv[3]);