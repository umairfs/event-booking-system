const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const validate = require('../middlewares/validate.middleware');
const { bookEventValidation, cancelBookingValidation  } = require('../validations/booking.validation');
const bookingRateLimiter = require('../middlewares/rateLimit.middleware');

// book events route
router.post('/events/:id/book', 
    bookingRateLimiter,
    bookEventValidation,
    validate, 
    bookingController.bookEvent
);

// cancel confirmed booking route
router.post('/:id/cancel', 
    cancelBookingValidation, 
    validate, 
    bookingController.cancelBooking
);

module.exports = router;