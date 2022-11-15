'use strict'

console.log('Our first server');

// REQUIRE
const express = require(express);
- require ('dotenv')/.config;

// USE
const app = express(); // app is the common naming convention
app.use(cors());
const PORT = process.env.PORT || 3002;

// ROUTES



// ERROR HANDLERS



// LISTEN
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
