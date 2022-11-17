'use strict';

console.log('Our first server');

const { response } = require('express');

// REQUIRE
const express = require('express');

require('dotenv').config();

let data = require('./data/weather.json');

const cors = require('cors');

// USE
const app = express(); // app is the common naming convention
app.use(cors());
const PORT = process.env.PORT || 3002;

// ROUTES
app.get('/', (request, response) => {
  response.send('Hello, from our server');
});

app.get('/weather', (request, response, next) => {
  try {
    // /weather?city=value - http://localhost:3001/weather?city=Seattle
    let cityInput = request.query.city; // From user
    let selectedCity = data.find(cityData => cityData.city_name === cityInput); // Going thru "data object 3 - 143"
    // if (cityInput !== 'Seattle' || cityInput !== 'Amman' || cityInput !== 'Paris') {
    //   return alert('Please pick Amman, Seattle, or Paris for your search.');
    // }
    let forecastArray = selectedCity.data.map((eachDay) => new Forecast(eachDay));

    // let cityCleanedUp = new City(selectedCity);
    response.send(forecastArray);
  } catch (error) {
    next(error);
  }
});

app.get('*', (request, response) => {
  response.send('That route does not exist.');
});


// ERROR HANDLERS
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

// CLASSES
class Forecast {
  constructor(day) {
    this.date = day.valid_date;
    this.description = day.weather.description;
  }
}


// LISTEN
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
