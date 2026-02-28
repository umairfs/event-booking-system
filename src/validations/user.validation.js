const { param } = require('express-validator');

exports.getUserBookingsValidation = [
    param('userId')
        .notEmpty().withMessage('User id is required')
        .isInt().withMessage('User id must be a number')
];