'use strict';

console.log('Our first server');

const { response } = require('express');

// REQUIRE
const express = require('express');

const axios = require('axios');

require('dotenv').config();

const cors = require('cors');

// USE
const app = express(); // app is the common naming convention
app.use(cors());
const PORT = process.env.PORT || 3002;

// ROUTES
app.get('/', (request, response) => {
  response.send('Hello, from our server');
});

app.get('/weather', async (request, response, next) => {
  try {
    console.log('Coming from the weather GET');
    // Latitude & Longitude variables from query search from user
    let latInput = request.query.lat;
    let longInput = request.query.long;

    // Data grabbed from WeatherBit
    let weaUrl = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lang=en&units=I&days=3&lat=${latInput}&lon=${longInput}`;
    let dirtyCity = await axios.get(weaUrl);

    // Create a Forecast object for each day of data
    let cityWeather = dirtyCity.data.data.map(day => new Forecast(day));

    response.send(cityWeather);
  } catch (error) {
    next(error);
  }
});

app.get('/movie', async (request, response, next) => {
  console.log('Coming from the movie GET');
  try {
    // Movie search from city query
    let movSearch = request.query.search;
    console.log(movSearch);

    //Data grabbed from movie d/b
    let movURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${movSearch}`;
    let movDirty = await axios.get(movURL);

    // Generate an object for each movie
    let movResults = movDirty.data.results.map(movie => new Movie(movie));

    response.send(movResults);
    console.log(movResults);
  } catch (error) {
    next(error);
  }
});

app.use('*', notFound);


// ERROR HANDLERS
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

// CLASSES
class Forecast {
  constructor(day) {
    this.date = day.valid_date;
    this.description = day.weather.description;
    this.low = day.low_temp;
    this.high = day.max_temp;
    this.fullDescription = `Today's weather is a low of ${this.low}F and a high of ${this.high}F with ${this.description}`;
  }
}

class Movie {
  constructor(movObject) {
    this.title = movObject.title;
    this.overview = movObject.overview;
    this.voteAvg = movObject.vote_average;
    this.totalVotes = movObject.vote_count;
    this.posterPath = movObject.poster_path ? `https://image.tmdb.org/t/p/original/${movObject.poster_path}` : ' ';
    this.relDate = movObject.release_date;
  }
}


function notFound(request, response) {
  response.send('Route not found!').status(404);
}

// LISTEN
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
