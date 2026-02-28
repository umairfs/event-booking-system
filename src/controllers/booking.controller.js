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

const getUserBookings = async (req, res) => {
    const { userId } = req.params;

    const result = await bookingService.getUserBookings(userId);

    if (result.status !== 200) {
        return res.status(result.status).json({
            success: false,
            message: result.message
        });
    }

    return res.status(200).json({
        success: true,
        data: result.data
    });
};

module.exports = {
    bookEvent,
    cancelBooking,
    getUserBookings
};
