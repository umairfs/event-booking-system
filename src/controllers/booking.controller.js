const bookingService = require('../services/booking.service');

const bookEvent = async (req, res) => {
    const eventId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'userId is required'
        });
    }

    const result = await bookingService.bookEvent(eventId, userId);

    return res.status(result.status).json({
        success: result.status === 200,
        message: result.message,
        bookingId: result.bookingId || null
    });
};

const cancelBooking = async (req, res) => {
    const bookingId = req.params.id;

    const result = await bookingService.cancelEventBooking(bookingId);

    return res.status(result.status).json({
        success: result.status === 200,
        message: result.message
    });
};

module.exports = {
    bookEvent,
    cancelBooking
};
