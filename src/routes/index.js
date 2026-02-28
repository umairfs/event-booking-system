const express = require('express');
const router = express.Router();
const eventRoutes = require('./event.routes');
const bookingRoutes = require('./booking.routes');
const userRoutes = require('./user.routes');

// booking route
router.use('/booking', bookingRoutes);

router.use('/events', eventRoutes);

router.use('/users', userRoutes);

module.exports = router;