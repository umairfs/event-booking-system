const bookingService = require('../services/booking.service');

const bookEvent = async (req, res) => {
    try {
        
        const eventId = req.params.id;
        const userId = req.user.id;
        // const { userId } = req.body;
    
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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
    
        const result = await bookingService.cancelEventBooking(bookingId);
    
        return res.status(result.status).json({
            success: result.status === 200,
            message: result.message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;
    
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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

module.exports = {
    bookEvent,
    cancelBooking,
    getUserBookings
};
