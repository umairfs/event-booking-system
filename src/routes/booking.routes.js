const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const validate = require('../middlewares/validate.middleware');
const { bookEventValidation, cancelBookingValidation  } = require('../validations/booking.validation');
const bookingRateLimiter = require('../middlewares/rateLimit.middleware');
const authenticate = require("../middlewares/auth.middleware");

// book events route
router.post('/events/:id/book', 
    bookingRateLimiter,
    authenticate,
    bookingController.bookEvent
);

// cancel confirmed booking route
router.post('/:id/cancel', 
    cancelBookingValidation,
    authenticate,
    validate, 
    bookingController.cancelBooking
);

router.get('/my', 
    authenticate,
    bookingController.getUserBookings
);

module.exports = router;