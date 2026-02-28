const rateLimit = require('express-rate-limit');

const bookingRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 requests per window
    message: {
        success: false,
        message: 'Too many booking attempts. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = bookingRateLimiter;