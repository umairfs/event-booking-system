const express = require('express');
const cors = require('cors');
const appRoutes = require('./routes/index');
require('dotenv').config();

const app = express();

// added cors and json converter
app.use(cors());
app.use(express.json());


// Welcom route
// app.get('/welcome', (req, res) => {
//     res.send('Event Booking System API Running');
// });


// Events route
app.use('/api', appRoutes);

module.exports = app;