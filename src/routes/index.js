const express = require('express');
const router = express.Router();
const eventRoutes = require('./event.routes');
const bookingRoutes = require('./booking.routes');

// booking route
router.use('/booking', bookingRoutes);

router.use('/events', eventRoutes);

module.exports = router;