const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

// book events route
router.post('/events/:id/book', bookingController.bookEvent);

// cancel confirmed booking route
router.post('/:id/cancel', bookingController.cancelBooking);

module.exports = router;