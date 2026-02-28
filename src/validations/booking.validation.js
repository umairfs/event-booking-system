const { body, param } = require('express-validator');

exports.bookEventValidation = [
    param('id')
        .notEmpty().withMessage('Event id is required')
        .isInt().withMessage('Event id must be a number'),

    body('userId')
        .notEmpty().withMessage('User id is required')
        .isInt().withMessage('User id must be a number')
];

exports.cancelBookingValidation = [
    param('id')
        .notEmpty().withMessage('Booking id is required')
        .isInt().withMessage('Booking id must be a number')
];