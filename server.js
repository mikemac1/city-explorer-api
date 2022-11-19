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

    // Latitude & Longitude variables from query search from user
    let latInput = request.query.lat;
    let longInput = request.query.long;
    console.log(longInput);
    // Data grabbed from WeatherBit
    let weaUrl = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lang=en&units=I&days=3&lat=${latInput}&lon=${longInput}`;

    let selectedCity = await axios.get(weaUrl);

    // Create a Forecast object for each day of data
    let cityWeather = selectedCity.data.data.map(day => new Forecast(day));
    response.send(cityWeather);
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

function notFound(request, response) {
  response.send('Route not found!').status(404);
}

// LISTEN
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
