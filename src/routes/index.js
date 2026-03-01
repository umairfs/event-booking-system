const express = require('express');
const router = express.Router();
const eventRoutes = require('./event.routes');
const bookingRoutes = require('./booking.routes');
const authRoutes = require("./auth.routes");

// booking route
router.use('/bookings', bookingRoutes);

router.use('/events', eventRoutes);

router.use("/auth", authRoutes);

module.exports = router;