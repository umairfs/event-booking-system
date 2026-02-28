const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const validate = require('../middlewares/validate.middleware');
const { getUserBookingsValidation } = require('../validations/user.validation');

// Final endpoint: /api/users/:userId/bookings
router.get('/:userId/bookings', 
    getUserBookingsValidation,
    validate, 
    bookingController.getUserBookings
);

module.exports = router;